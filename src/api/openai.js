const MODEL_NAME = "gpt-4o-mini";

// In development, call OpenAI directly. In production, use the proxy.
const isDev = import.meta.env.DEV;
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

export async function callOpenAI(prompt, base64Image = null, mimeType = 'image/jpeg') {
  let delay = 1000;
  
  for (let i = 0; i < 5; i++) {
    try {
      let response;
      
      if (isDev) {
        // Development: call OpenAI API directly
        if (!API_KEY) {
          throw new Error("OpenAI API key missing. Set VITE_OPENAI_API_KEY in .env");
        }
        
        const messages = [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...(base64Image ? [{
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64Image}` }
              }] : [])
            ],
          },
        ];
        
        response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages,
            max_tokens: 4096,
            response_format: { type: "json_object" }
          })
        });
      } else {
        // Production: use Cloudflare Pages Function proxy
        response = await fetch("/api/openai", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, base64Image, mimeType })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from API");
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
