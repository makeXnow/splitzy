const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const MODEL_NAME = "gpt-4o-mini"; // Cheapest and highly capable vision model

export async function callOpenAI(prompt, base64Image = null, mimeType = 'image/jpeg') {
  if (!API_KEY) {
    console.warn("OpenAI API key is missing. Please set VITE_OPENAI_API_KEY.");
    throw new Error("API key missing");
  }

  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        ...(base64Image ? [{
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`
          }
        }] : [])
      ],
    },
  ];

  const responseSchema = {
    type: "json_schema",
    json_schema: {
      name: "receipt_analysis",
      strict: true,
      schema: {
        type: "OBJECT",
        properties: {
          items: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                price: { type: "NUMBER" }
              },
              required: ["name", "price"],
              additionalProperties: false
            }
          },
          total: { type: "NUMBER" },
          currencySymbol: { type: "STRING" }
        },
        required: ["items", "total", "currencySymbol"],
        additionalProperties: false
      }
    }
  };

  const url = "https://api.openai.com/v1/chat/completions";

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages,
          response_format: responseSchema
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === 4) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
