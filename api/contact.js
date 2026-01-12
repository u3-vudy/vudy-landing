// Vercel Serverless Function to handle ClickUp form submissions
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

        // ClickUp API configuration (from environment variables for security)
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

        // Create task in ClickUp
        const response = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            method: 'POST',
            headers: {
                'Authorization': CLICKUP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `New Lead: ${name} - ${useCase.substring(0, 50)}`,
                description: description,
                tags: ['website-lead'],
                priority: 3,
                status: 'to do'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('ClickUp API Error:', errorData);
            throw new Error('Failed to create task in ClickUp');
        }

        const data = await response.json();
        
        return res.status(200).json({ 
            success: true, 
            message: 'Contact form submitted successfully',
            taskId: data.id 
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};
