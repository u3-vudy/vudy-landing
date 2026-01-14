// Vercel Serverless Function to handle ClickUp schedule call submissions
const https = require('https');

// List ID for CITAS in ClickUp
const DEFAULT_SCHEDULE_LIST_ID = '901112904242';

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, company, dateTime, timezone, channel, notes } = req.body || {};

        // Validate required fields
        if (!name || !email || !dateTime || !timezone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ClickUp API configuration (from environment variables)
        const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
        const CLICKUP_SCHEDULE_LIST_ID = process.env.CLICKUP_SCHEDULE_LIST_ID || DEFAULT_SCHEDULE_LIST_ID;

        if (!CLICKUP_API_KEY) {
            console.error('Missing ClickUp API key');
            return res.status(500).json({
                error: 'Configuration error',
                message: 'ClickUp API key is not configured properly'
            });
        }

        // Create task description
        const description = `**Call Request:**
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}

**Preferred schedule:**
Date & time (local): ${dateTime}
Timezone: ${timezone}
Channel: ${channel || 'N/A'}

**Notes:**
${notes || 'N/A'}`;

        // Prepare ClickUp task data
        const taskData = JSON.stringify({
            name: `Call request: ${name} - ${dateTime}`,
            description,
            tags: ['website-call'],
            priority: 3
        });

        const clickupResponse = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.clickup.com',
                path: `/api/v2/list/${CLICKUP_SCHEDULE_LIST_ID}/task?custom_task_ids=false`,
                method: 'POST',
                headers: {
                    'Authorization': CLICKUP_API_KEY,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(taskData)
                }
            };

            const apiReq = https.request(options, (apiRes) => {
                let data = '';

                apiRes.on('data', (chunk) => {
                    data += chunk;
                });

                apiRes.on('end', () => {
                    if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
                        resolve({ success: true, data: JSON.parse(data) });
                    } else {
                        console.error('ClickUp Error Response:', data);
                        resolve({ success: false, error: data, statusCode: apiRes.statusCode });
                    }
                });
            });

            apiReq.on('error', (error) => {
                console.error('Request Error:', error);
                reject(error);
            });

            apiReq.write(taskData);
            apiReq.end();
        });

        if (!clickupResponse.success) {
            console.error('ClickUp API Error:', clickupResponse);
            return res.status(500).json({
                error: 'Failed to create task',
                message: 'Could not create task in ClickUp',
                details: clickupResponse.error
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Schedule call request submitted successfully',
            taskId: clickupResponse.data.id
        });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

