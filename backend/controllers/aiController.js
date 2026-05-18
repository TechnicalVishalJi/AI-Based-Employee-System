const axios = require('axios');

exports.recommend = async (req, res) => {
    try {
        const { employees } = req.body; // Can accept single or multiple employees for ranking

        if (!employees || !Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({ error: 'Please provide an array of employees' });
        }

        const prompt = `
        Analyze the following employee data and provide performance recommendations.
        Employees: ${JSON.stringify(employees, null, 2)}
        
        You must return ONLY a raw JSON object (without any markdown formatting or backticks) with the following structure:
        {
            "recommendations": [
                {
                    "employeeEmail": "email@example.com",
                    "promotionRecommendation": "Yes/No, with brief reason",
                    "trainingSuggestions": ["Skill 1", "Skill 2"],
                    "aiFeedback": "Detailed constructive feedback"
                }
            ],
            "ranking": ["email1@example.com", "email2@example.com"] // Ordered from best to worst based on performanceScore and skills
        }
        `;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemma-4-31b-it",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiContent = response?.data?.choices?.[0]?.message?.content;

        if (!aiContent || typeof aiContent !== "string") {
            return res.status(500).json({
                error: "AI returned invalid response",
                rawResponse: response?.data || 'No response data'
            });
        }

        let cleaned = aiContent
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (err) {
            return res.status(500).json({
                error: "Failed to parse AI JSON",
                rawText: cleaned,
                rawResponse: response.data
            });
        }

        res.json(parsed);

    } catch (err) {
        console.error("AI Error:", err.message);
        res.status(500).json({ 
            error: 'Server error during AI recommendation',
            details: err.response?.data || err.message
        });
    }
};
