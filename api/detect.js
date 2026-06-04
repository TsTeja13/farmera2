export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    try {

        const { imageBase64 } = req.body;

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
                                    text: `
You are an expert plant pathologist and agriculture scientist.

Analyze this plant image carefully.

Provide:

1. Disease Name
2. Confidence Level (Low/Medium/High)
3. Symptoms
4. Possible Causes
5. Organic Treatment
6. Prevention Tips

If the plant appears healthy, clearly state that.

Format the response using simple farmer-friendly language.
`
                                },
                                {
                                    inline_data: {
                                        mime_type: "image/jpeg",
                                        data: imageBase64
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const result =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Unable to analyze image.";

        return res.status(200).json({
            result
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            result: "Server Error"
        });
    }
}