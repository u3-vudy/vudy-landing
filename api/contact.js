// Vercel Serverless Function to handle ClickUp form submissions
const https = require('https');

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
        const { name, email, company, useCase, message } = req.body;

        // Validate required fields
        if (!name || !email || !useCase) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ClickUp API configuration
        const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY || 'JQF5J7QC4L0J6TIWXIRFU9GNZFS9DFYFJOQYWZU5UPGITMLM2TG1LAHR1RKDL0FX';
        const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID || '901112892172';

        // Create task description
        const description = `**Contact Information:**
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}

**Use Case:**
${useCase}

**Additional Details:**
${message || 'N/A'}`;

        // Prepare ClickUp task data
        const taskData = JSON.stringify({
            name: `New Lead: ${name} - ${useCase.substring(0, 50)}`,
            description: description,
            tags: ['website-lead'],
            priority: 3
        });

        // Verify API key exists
        if (!CLICKUP_API_KEY || CLICKUP_API_KEY === 'undefined') {
            console.error('ClickUp API Key is missing!');
            return res.status(500).json({ 
                error: 'Configuration error',
                message: 'ClickUp API key is not configured'
            });
        }

        console.log('Using API Key (first 10 chars):', CLICKUP_API_KEY.substring(0, 10) + '...');
        console.log('Using List ID:', CLICKUP_LIST_ID);

        // Make request to ClickUp API
        const clickupResponse = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.clickup.com',
                path: `/api/v2/list/${CLICKUP_LIST_ID}/task?custom_task_ids=false`,
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
            message: 'Contact form submitted successfully',
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
