const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.use(express.static(
    path.join(__dirname, "L
              Public")
));

app.post("/api/chat", async (req, res) => {

    try {

        const messages = req.body.messages || [];

        const response = await client.responses.create({

            model: "gpt-5-mini",

            instructions: `
You are CALM AI.

You are a friendly and helpful AI assistant.

Understand the user's language and reply
in the same language whenever possible.

You can help with:
- General questions
- School subjects
- Mathematics
- Science
- Coding
- Writing
- Translation
- Explanations
- Conversation

Give clear and useful answers.
`,

            input: messages

        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "CALM AI could not respond."
        });

    }

});


app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


app.listen(PORT, () => {

    console.log(
        `CALM AI running on port ${PORT}`
    );

});
