export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    try {

        const { message } = req.body;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        `You are an expert agriculture assistant.
                                         Help farmers with crops, diseases,
                                         organic farming, irrigation, soil,
                                         government schemes and farming techniques.

                                         Question: ${message}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I could not generate a response.";

        return res.status(200).json({
            reply
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            reply: "Server Error"
        });
    }
}