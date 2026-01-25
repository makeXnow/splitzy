const MODEL_NAME = "gemini-2.0-flash";

// In development, call Gemini directly. In production, use the proxy.
const isDev = import.meta.env.DEV;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export async function callGemini(prompt, base64Image = null, mimeType = 'image/jpeg') {
  console.log('DEBUG: callGemini entry', { isDev, hasKey: !!API_KEY });
  try {
    let response;
    
    if (isDev) {
        console.log('DEBUG: calling Gemini API directly');
        // Development: call Gemini API directly
        if (!API_KEY) {
          throw new Error("Gemini API key missing. Set VITE_GEMINI_API_KEY in .env");
        }
        
        const parts = [
          { text: prompt },
          ...(base64Image ? [{
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }] : [])
        ];
        
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
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
      } else {
        console.log('DEBUG: calling Cloudflare proxy');
        // Production: use Cloudflare Pages Function proxy
        // Force the use of the CURRENT origin to avoid cross-domain redirects
        const proxyUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}/api/gemini`.replace(/\/+/g, '/').replace(':/', '://');
        console.log('DEBUG: proxyUrl', proxyUrl);
        response = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, base64Image, mimeType })
        });
      }

      console.log('DEBUG: response received', { ok: response.ok, status: response.status });

      if (!response.ok) {
        let errorDetail = '';
        try {
          errorDetail = await response.text();
        } catch (e) {
          errorDetail = `Could not read error body: ${e.message}`;
        }
        
        console.error('DEBUG: response not ok', { 
          status: response.status, 
          statusText: response.statusText,
          errorDetail,
          url: response.url 
        });
        throw new Error(`Server error (${response.status}): ${errorDetail || response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('DEBUG: json parse failed', { e });
        throw new Error(`Failed to parse server response as JSON: ${e.message}`);
      }
      
      console.log('DEBUG: data received', { hasCandidates: !!data.candidates });
      
      // Gemini response format
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error("Empty response from API");
      }

      return JSON.parse(content);
    } catch (error) {
      console.error(`Request failed:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
}
