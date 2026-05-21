const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const initialGeneralInfo = {
  phone: '+53 7 830 0793',
  email: 'catedralrestaurantecuba@gmail.com',
  address: 'Calle 8 entre Calzada y 5ta, Vedado, La Habana, Cuba',
  mapUrl: 'https://www.google.com/maps?q=23.1302190,-82.4032210',
  scheduleEs: 'Desayuno: 8:30 – 11:00 am  ·  Almuerzo & Cena: 12:00 m – 10:00 pm',
  scheduleEn: 'Breakfast: 8:30 – 11:00 am  ·  Lunch & Dinner: 12:00 pm – 10:00 pm',
  whatsapp: '5378300793',
  instagram: 'lacatedralcuba',
  facebook: 'mirestaurantencuba',
  whatsappGroup: 'https://chat.whatsapp.com/BoaqXwjmrjsEPLkzYY3bLI?mode=gi_t'
};

const fetchStateFromSupabase = async () => {
  if (!supabase) {
    return {
      menuItems: [],
      galleryItems: [],
      generalInfo: initialGeneralInfo
    };
  }

  try {
    const [menuRes, galleryRes, infoRes] = await Promise.all([
      supabase.from('menu_items').select('*'),
      supabase.from('gallery_items').select('*'),
      supabase.from('general_info').select('*').eq('id', 'default')
    ]);

    const menuItems = (menuRes.data || []).map((item) => ({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory,
      nameEs: item.name_es,
      nameEn: item.name_en,
      descEs: item.desc_es,
      descEn: item.desc_en,
      price: item.price,
      available: item.available
    }));

    const galleryItems = (galleryRes.data || []).map((item) => ({
      id: item.id,
      category: item.category,
      imageSrc: item.image_url
    }));

    const generalInfo = infoRes.data?.[0] ? {
      phone: infoRes.data[0].phone || '',
      email: infoRes.data[0].email || '',
      address: infoRes.data[0].address || '',
      mapUrl: infoRes.data[0].map_url || '',
      scheduleEs: infoRes.data[0].schedule_es || '',
      scheduleEn: infoRes.data[0].schedule_en || '',
      whatsapp: infoRes.data[0].whatsapp || '',
      instagram: infoRes.data[0].instagram || '',
      facebook: infoRes.data[0].facebook || '',
      whatsappGroup: infoRes.data[0].whatsapp_group || ''
    } : initialGeneralInfo;

    return { menuItems, galleryItems, generalInfo };
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return {
      menuItems: [],
      galleryItems: [],
      generalInfo: initialGeneralInfo
    };
  }
};

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET') {
      const state = await fetchStateFromSupabase();
      return res.status(200).json(state);
    }

    if (req.method === 'POST') {
      const newState = req.body;
      if (!newState) {
        return res.status(400).json({ error: 'Request body is empty' });
      }

      if (!supabase) {
        return res.status(500).json({ error: 'Supabase not configured' });
      }

      if (newState.menuItems && newState.menuItems.length > 0) {
        const menuData = newState.menuItems.map((item) => ({
          id: item.id,
          category: item.category,
          subcategory: item.subcategory,
          name_es: item.nameEs,
          name_en: item.nameEn,
          desc_es: item.descEs,
          desc_en: item.descEn,
          price: item.price,
          available: item.available
        }));

        await supabase.from('menu_items').upsert(menuData);
      }

      if (newState.galleryItems && newState.galleryItems.length > 0) {
        const galleryData = newState.galleryItems.map((item) => ({
          id: item.id,
          category: item.category,
          image_url: item.imageSrc,
          image_bucket: item.imageSrc.includes('data:') ? null : 'gallery'
        }));

        await supabase.from('gallery_items').upsert(galleryData);
      }

      if (newState.generalInfo) {
        const infoData = {
          id: 'default',
          phone: newState.generalInfo.phone,
          email: newState.generalInfo.email,
          address: newState.generalInfo.address,
          map_url: newState.generalInfo.mapUrl,
          schedule_es: newState.generalInfo.scheduleEs,
          schedule_en: newState.generalInfo.scheduleEn,
          whatsapp: newState.generalInfo.whatsapp,
          instagram: newState.generalInfo.instagram,
          facebook: newState.generalInfo.facebook,
          whatsapp_group: newState.generalInfo.whatsappGroup
        };

        await supabase.from('general_info').upsert(infoData);
      }

      const state = await fetchStateFromSupabase();
      return res.status(200).json({ success: true, message: 'Se han guardado los cambios exitosamente.', state });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/state:', err);
    return res.status(500).json({ error: 'Error processing request', details: String(err) });
  }
};
