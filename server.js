const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "Public")));

app.post("/api/chat", async (req, res) => {
    try {
        const messages = req.body.messages || [];

        const conversation = messages
            .map(m => `${m.role}: ${m.content}`)
            .join("\n");

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are CALM AI, a friendly and helpful multilingual AI assistant.

Reply in the same language as the user whenever possible.
Give clear, useful and easy-to-understand answers.

Conversation:
${conversation}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            return res.status(500).json({
                error: "Gemini API error"
            });
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I could not generate a reply.";

        res.json({ reply });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "CALM AI could not respond."
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "Public", "index.html")
    );
});

app.listen(PORT, () => {
    console.log(`CALM AI running on port ${PORT}`);
});
