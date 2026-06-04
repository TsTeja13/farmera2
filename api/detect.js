export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        result: "No image received."
      });
    }

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
You are an agricultural expert.

Analyze this plant image and provide:

1. Crop Name
2. Disease Name
3. Confidence Percentage
4. Symptoms
5. Causes
6. Organic Treatment
7. Prevention Tips

If healthy, say "Plant appears healthy".
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

    console.log("Gemini Response:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({
        result: data.error?.message || "Gemini API Error"
      });
    }

    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No disease information returned.";

    return res.status(200).json({
      result
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      result: error.message
    });
  }
}