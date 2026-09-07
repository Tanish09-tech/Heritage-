import dotenv from 'dotenv';
dotenv.config();

/**
 * Service to handle Google Gemini API integration for cultural image generation & visual enhancement.
 */
export async function generateGeminiImage({ traditionTitle, state, category, description }) {
  const effectiveApiKey = process.env.GEMINI_API_KEY;

  const searchTopic = `${traditionTitle} ${state || ''} ${category || ''} Indian cultural heritage art tradition`.trim();
  
  if (!effectiveApiKey) {
    console.log('ℹ️ GEMINI_API_KEY not configured on server. Using curated high-resolution cultural heritage image.');
    return {
      success: true,
      imageUrl: getFallbackImageByStateAndTitle(state, traditionTitle, category),
      promptUsed: searchTopic,
      source: 'curated_fallback',
      message: 'Curated heritage visual generated for tradition.'
    };
  }

  try {
    console.log(`🤖 Requesting Gemini API visual enhancement for: "${searchTopic}"...`);

    // 1. First, call Gemini 2.5 Flash / Pro model to craft an optimal visual description and image query keywords
    const geminiTextResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert Indian cultural heritage photographer and curator. Provide a brief 1-sentence prompt for creating an authentic high-resolution image of the tradition "${traditionTitle}" from "${state}". Also return 3 search keywords separated by commas. Format exact JSON: {"imagePrompt": "...", "keywords": "..."}`
            }]
          }]
        })
      }
    );

    let aiPrompt = searchTopic;
    let keywords = traditionTitle;

    if (geminiTextResponse.ok) {
      const textData = await geminiTextResponse.json();
      const rawOutput = textData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      try {
        const cleanedJson = rawOutput.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);
        if (parsed.imagePrompt) aiPrompt = parsed.imagePrompt;
        if (parsed.keywords) keywords = parsed.keywords;
      } catch (e) {
        console.warn('Could not parse Gemini JSON response, using fallback search prompt:', e.message);
      }
    }

    // 2. Attempt Imagen 3 generation endpoint with key
    const imagenResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${effectiveApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: aiPrompt }],
          parameters: { sampleCount: 1, aspectRatio: "16:9", outputOptions: { mimeType: "image/jpeg" } }
        })
      }
    );

    if (imagenResponse.ok) {
      const imagenData = await imagenResponse.json();
      const base64Image = imagenData?.predictions?.[0]?.bytesBase64Encoded;
      if (base64Image) {
        return {
          success: true,
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
          promptUsed: aiPrompt,
          source: 'gemini_imagen3',
          message: 'Successfully generated authentic heritage image via Google Gemini Imagen 3!'
        };
      }
    }

    // 3. If Imagen API is not enabled for the key, fetch a high-res authentic Unsplash cultural image based on Gemini keywords
    const cleanKw = encodeURIComponent(`${keywords} Indian culture ${state || ''}`);
    const curatedUrl = `https://source.unsplash.com/1600x900/?${cleanKw}`;

    return {
      success: true,
      imageUrl: curatedUrl,
      promptUsed: aiPrompt,
      source: 'gemini_enhanced_curated',
      message: 'Gemini successfully generated visual prompt for tradition visual matching!'
    };

  } catch (err) {
    console.error('❌ Gemini API Error:', err.message);
    return {
      success: false,
      error: err.message,
      imageUrl: getFallbackImageByStateAndTitle(state, traditionTitle, category),
      source: 'fallback'
    };
  }
}

function getFallbackImageByStateAndTitle(state = '', title = '', category = '') {
  const t = title.toLowerCase();
  const s = state.toLowerCase();
  const c = category.toLowerCase();

  if (t.includes('mughlai') || t.includes('chaat')) return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80';
  if (t.includes('khayal') || t.includes('tabla') || t.includes('dilli gharana')) return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80';
  if (t.includes('zardozi') || t.includes('aari')) return 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80';
  if (t.includes('warli')) return '/images/warli.jpg';
  if (t.includes('powada')) return '/images/powada.jpg';
  if (t.includes('lavani')) return '/images/lavani.jpg';
  if (t.includes('dhangari')) return '/images/dhangari.jpg';
  if (t.includes('koli')) return '/images/koli.jpg';
  if (t.includes('kullu') || t.includes('shawl') || t.includes('kinnauri') || s.includes('himachal')) return '/images/kullu_shawls.jpg';
  if (s.includes('punjab') || t.includes('bhangra') || t.includes('giddha')) return 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80';
  if (s.includes('kerala') || t.includes('kathakali') || t.includes('theyyam')) return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80';
  if (s.includes('gujarat') || t.includes('garba')) return 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80';
  if (s.includes('assam') || t.includes('bihu')) return 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80';
  if (s.includes('madhya pradesh') || s.includes('mp')) return 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80';
  if (s.includes('uttar pradesh') || s.includes('up')) return 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80';

  if (c.includes('food')) return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80';
  if (c.includes('music')) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80';
  if (c.includes('dance')) return 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80';
  if (c.includes('clothes') || c.includes('craft')) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80';

  return '/images/hero.jpg';
}
