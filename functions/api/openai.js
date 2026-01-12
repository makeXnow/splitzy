export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const OPENAI_API_KEY = env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OpenAI API key not configured on Cloudflare" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { prompt, base64Image, mimeType = 'image/jpeg' } = await request.json();

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
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { 
                    type: "string",
                    description: "The name of the item. FORMAT: [EMOJI(S)] [QUANTITYx] [NAME]. 1. MUST start with 1-2 relevant emojis and a space. 2. If quantity > 1, add quantity then 'x' and a space. DO NOT add '1x'. 3. Then the item name."
                  },
                  price: { type: "number" }
                },
                required: ["name", "price"],
                additionalProperties: false
              }
            },
            tax: { type: "number" },
            tip: { type: "number" },
            fees: { type: "number" },
            total: { type: "number" },
            currencySymbol: { type: "string" }
          },
          required: ["items", "tax", "tip", "fees", "total", "currencySymbol"],
          additionalProperties: false
        }
      }
    };

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        response_format: responseSchema
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      return new Response(JSON.stringify({ error: errorData.error?.message || "OpenAI API error" }), {
        status: openaiResponse.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await openaiResponse.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
