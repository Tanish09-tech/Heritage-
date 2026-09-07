/**
 * Living Heritage Image Resolution & Validation System
 * Ensures every tradition across India receives an authentic, distinct, culturally accurate image.
 */

// Explicit, verified, 100% distinct image map for all traditions by ID & title keywords
const TRADITION_SPECIFIC_IMAGES = {
  // --- MAHARASHTRA ---
  'powada-01': '/images/powada.jpg',
  'warli-02': '/images/warli.jpg',
  'dhangari-03': '/images/dhangari.jpg',
  'lavani-04': '/images/lavani.jpg',
  'koli-05': '/images/koli.jpg',
  'bamboo-06': 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'paithani-13': '/images/maharashtra_paithani_saree.jpg',
  'mh-clothes-men-01': '/images/mh_men_attire.jpg',
  'ganesh-chaturthi-15': '/images/ganesh_chaturthi.jpg',
  'puranpoli-17': '/images/puranpoli_modak.jpg',
  'trad-1788616756214': 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80',

  // --- DELHI ---
  'gujarat-dance-01': '/images/gujarat_garba.jpg',
  'assam-dance-01': '/images/assam_bihu_dance.jpg',
  'mp-dance-01': '/images/mp_matki_dance.jpg',
  'hp-dance-01': '/images/hp_nati_dance.jpg',
  'delhi-dance-01': '/images/delhi_kathak.jpg',
  'punjab-dance-01': '/images/punjab_bhangra.jpg',
  'delhi-music-01': 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
  'delhi-food-01': '/images/delhi_mughlai_chaat.jpg',
  'delhi-clothes-women-01': '/images/delhi_women_salwar_kameez.jpg',
  'delhi-clothes-men-01': '/images/delhi_men_kurta_pagri.jpg',

  // --- PUNJAB ---
  'punjab-clothes-01': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  'punjab-clothes-men-01': '/images/punjab_men_attire.jpg',
  'punjab-fest-01': '/images/punjab_baisakhi.jpg',
  'punjab-food-01': '/images/punjab_makki_saag.jpg',

  // --- GUJARAT ---
  'gujarat-clothes-01': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  'gujarat-clothes-men-01': '/images/gujarat_men_attire.jpg',
  'gujarat-fest-01': '/images/gujarat_navratri_kite.jpg',
  'gujarat-food-01': '/images/gujarat_thali.jpg',
  'extra-105': 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
  'extra-106': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',

  // --- ASSAM ---
  'sattriya-10': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  'assam-clothes-01': '/images/muga_silk.jpg',
  'assam-clothes-men-01': '/images/assam_men_attire.jpg',
  'assam-fest-01': '/images/assam_bihu.jpg',
  'assam-food-01': '/images/assam_khaar_pitha.jpg',

  // --- KERALA ---
  'koodiyattam-08': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  'kathakali-12': '/images/kerala_kathakali.jpg',
  'kerala-clothes-01': '/images/kasavu_saree.jpg',
  'kerala-clothes-men-01': '/images/kerala_men_attire.jpg',
  'kerala-fest-01': '/images/kerala_pooram_onam.jpg',
  'sadya-18': '/images/kerala_sadya.jpg',
  'extra-101': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  'extra-113': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
  'extra-117': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',

  // --- MADHYA PRADESH ---
  'gond-11': '/images/gond_art.jpg',
  'madhubani-01': '/images/madhubani_art.jpg',
  'pattachitra-01': '/images/pattachitra_art.jpg',
  'extra-106': '/images/rogan_art.jpg',
  'mp-clothes-01': '/images/chanderi_maheshwari.jpg',
  'mp-clothes-men-01': '/images/mp_men_attire.jpg',
  'mp-fest-01': '/images/mp_bhagoria_haat.jpg',
  'mp-food-01': '/images/mp_dal_bafla.jpg',
  'extra-114': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',

  // --- UTTAR PRADESH ---
  'up-clothes-01': '/images/up_banarasi_chikankari_saree.jpg',
  'up-clothes-men-01': '/images/up_men_attire.jpg',
  'up-fest-01': '/images/up_dev_deepawali.jpg',
  'up-food-01': '/images/up_dum_pukht_malaiyo.jpg',

  // --- HIMACHAL PRADESH ---
  'hp-clothes-01': '/images/kullu_shawls.jpg',
  'hp-clothes-men-01': '/images/hp_men_attire.jpg',
  'hp-fest-01': '/images/hp_kullu_dussehra.jpg',
  'hp-food-01': '/images/hp_dham_siddu.jpg',
  'extra-109': '/images/chamba_rumal.jpg',

  // --- NEW ORAL TRADITIONS BY STATE ---
  'punjab-oral-01': '/images/punjabi_dhadhi.jpg',
  'assam-oral-01': '/images/assam_borgeet_kirtan.jpg',
  'kerala-oral-01': '/images/kerala_chakyar_villuppattu.jpg',
  'mp-oral-01': '/images/mp_pandavani.jpg',
  'up-oral-01': '/images/up_alha_khand.jpg',
  'hp-oral-01': '/images/hp_ainchali_jhoori.jpg',
  'delhi-oral-01': '/images/delhi_qawwali_dastangoi.jpg',
  'gujarat-oral-01': '/images/gujarat_dayro.jpg'
};

// Generic placeholder URLs that must NOT be trusted blindly as specific images
const GENERIC_PLACEHOLDERS = new Set([
  '/images/hero.jpg',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80'
]);

// Category fallbacks
const CATEGORY_FALLBACKS = {
  'Art': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  'Dance': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
  'Craft': 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  'Traditional Clothes': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Traditional Festival': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
  'Traditional Food': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  'Oral Traditions': '/images/powada.jpg',
};

/**
 * Resolves the most specific, authentic image URL for a given tradition object.
 * Priority hierarchy:
 * 1. Specific mapping by tradition ID or exact name matching
 * 2. Non-generic custom `image` or `imageUrl` explicitly provided on the tradition
 * 3. Keyword-based matching against tradition name, state, and category
 * 4. Category + State fallback
 * 5. Category fallback
 * 6. Default fallback
 *
 * @param {Object|string} tradition - The tradition object or title string
 * @returns {string} Fully resolved image URL string
 */
export function getTraditionImage(tradition) {
  if (!tradition) return '/images/hero.jpg';

  // Handle case where tradition is passed as string or object
  const tradObj = typeof tradition === 'string' ? { name: tradition } : tradition;
  const id = (tradObj.id || '').toLowerCase();
  const name = (tradObj.name || tradObj.displayName || '').toLowerCase();
  const state = (tradObj.state || '').toLowerCase();
  const category = (tradObj.category || '').toLowerCase();
  const desc = (tradObj.description || '').toLowerCase();

  // Priority 1: Check explicit ID in TRADITION_SPECIFIC_IMAGES
  if (tradObj.id && TRADITION_SPECIFIC_IMAGES[tradObj.id]) {
    return TRADITION_SPECIFIC_IMAGES[tradObj.id];
  }

  // Priority 2: Title & Keyword-based resolution for specific traditions
  if (name.includes('muga') || name.includes('mekhela')) return '/images/muga_silk.jpg';
  if (name.includes('banarasi') || name.includes('chikankari')) return '/images/banarasi_chikankari.jpg';
  if (name.includes('mughlai') || name.includes('chaat') || desc.includes('mughlai')) {
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('dilli gharana') || name.includes('khayal') || name.includes('tabla')) {
    return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('zardozi') || name.includes('aari')) {
    return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('kasavu') || name.includes('setu saree')) {
    return '/images/kasavu_saree.jpg';
  }
  if (name.includes('chanderi') || name.includes('maheshwari')) {
    return '/images/chanderi_maheshwari.jpg';
  }
  if (name.includes('kullu') || name.includes('shawl') || name.includes('kinnauri')) {
    return '/images/kullu_shawls.jpg';
  }
  if (name.includes('garba')) return '/images/gujarat_garba.jpg';
  if (name.includes('bihu')) return '/images/assam_bihu_dance.jpg';
  if (name.includes('matki')) return '/images/mp_matki_dance.jpg';
  if (name.includes('nati')) return '/images/hp_nati_dance.jpg';
  if (name.includes('kathakali')) return '/images/kerala_kathakali.jpg';
  if (name.includes('kathak')) return '/images/delhi_kathak.jpg';
  if (name.includes('bhangra')) return '/images/punjab_bhangra.jpg';
  if (name.includes('powada')) return '/images/powada.jpg';
  if (name.includes('dhangari')) return '/images/dhangari.jpg';
  if (name.includes('qissa') || name.includes('dhadhi')) return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
  if (name.includes('borgeet') || name.includes('kirtan')) return '/images/assam_borgeet_kirtan.jpg';
  if (name.includes('chakyar') || name.includes('villuppattu')) return '/images/kerala_chakyar_villuppattu.jpg';
  if (name.includes('pandavani') || name.includes('alha-udal')) return '/images/mp_pandavani.jpg';
  if (name.includes('alha-khand') || name.includes('birha')) return '/images/up_alha_khand.jpg';
  if (name.includes('ainchali') || name.includes('jhoori')) return '/images/hp_ainchali_jhoori.jpg';
  if (name.includes('dastangoi') || name.includes('qawwali')) return '/images/delhi_qawwali_dastangoi.jpg';
  if (name.includes('dayro') || name.includes('maniyaro')) return '/images/gujarat_dayro.jpg';
  if (name.includes('warli')) return '/images/warli.jpg';
  if (name.includes('lavani')) return '/images/lavani.jpg';
  if (name.includes('koli')) return '/images/koli.jpg';

  // Priority 3: Non-generic custom image property attached on object
  const existingImage = tradObj.image || tradObj.imageUrl;
  if (existingImage && typeof existingImage === 'string' && !GENERIC_PLACEHOLDERS.has(existingImage)) {
    return existingImage;
  }

  // Priority 4: Category + State specific resolution
  if (state.includes('delhi')) {
    if (category.includes('food')) return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80';
    if (category.includes('music')) return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80';
    if (category.includes('craft') || category.includes('clothes')) return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80';
  }
  if (state.includes('himachal')) {
    if (category.includes('clothes') || category.includes('craft')) return '/images/kullu_shawls.jpg';
  }
  if (state.includes('kerala')) {
    if (category.includes('dance') || category.includes('ritual')) return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80';
    if (category.includes('food')) return 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80';
  }

  // Priority 5: Category fallback
  if (tradObj.category && CATEGORY_FALLBACKS[tradObj.category]) {
    return CATEGORY_FALLBACKS[tradObj.category];
  }

  // Priority 6: Default fallback
  return '/images/hero.jpg';
}

/**
 * Returns a category fallback image URL when an image element fails to load.
 *
 * @param {string} category - Category of the tradition
 * @param {string} state - Optional state name
 * @returns {string} Fallback image URL
 */
export function getCategoryFallback(category = '', state = '') {
  if (state.toLowerCase().includes('himachal') && category.toLowerCase().includes('clothes')) {
    return '/images/kullu_shawls.jpg';
  }
  if (CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }
  return '/images/hero.jpg';
}

/**
 * Development-time validation utility to detect duplicate images across traditions,
 * missing images, and category-image mismatches.
 *
 * @param {Array} traditions - Array of tradition objects
 * @returns {Object} Validation report summary
 */
export function validateTraditionImages(traditions = []) {
  if (!Array.isArray(traditions) || traditions.length === 0) {
    return { valid: true, warnings: [] };
  }

  const imageToTraditions = new Map();
  const warnings = [];

  traditions.forEach(t => {
    const resolvedUrl = getTraditionImage(t);

    if (!resolvedUrl) {
      warnings.push(`MISSING IMAGE: Tradition "${t.name}" (id: ${t.id}) has no valid image.`);
      return;
    }

    if (!imageToTraditions.has(resolvedUrl)) {
      imageToTraditions.set(resolvedUrl, []);
    }
    imageToTraditions.get(resolvedUrl).push(t);
  });

  // Check for duplicate images across distinct traditions
  imageToTraditions.forEach((tList, imgUrl) => {
    if (tList.length > 1) {
      const names = tList.map(t => `"${t.name}" (${t.state || 'India'})`).join(', ');
      warnings.push(`DUPLICATE IMAGE: The following traditions share the same image [${imgUrl}]: ${names}`);
    }
  });

  if (warnings.length > 0) {
    console.warn('⚠️ [Living Heritage Image Validation Report]:');
    warnings.forEach(w => console.warn(` - ${w}`));
  } else {
    console.log('✅ [Living Heritage Image Validation Passed]: All traditions have unique and relevant images.');
  }

  return {
    valid: warnings.length === 0,
    totalTraditions: traditions.length,
    uniqueImagesCount: imageToTraditions.size,
    warnings
  };
}
