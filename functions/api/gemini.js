export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "Gemini API key not configured on Cloudflare" }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const { prompt, base64Image, mimeType = 'image/jpeg' } = await request.json();

    const parts = [
      { text: prompt },
      ...(base64Image ? [{
        inlineData: {
          mimeType: mimeType,
          data: base64Image
        }
      }] : [])
    ];

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 2000
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      return new Response(JSON.stringify({ error: errorData.error?.message || "Gemini API error" }), {
        status: geminiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await geminiResponse.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      return new Response(JSON.stringify({ error: "Empty response from Gemini" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Return the parsed content wrapped in the format expected by the client
    return new Response(JSON.stringify({ candidates: data.candidates }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
