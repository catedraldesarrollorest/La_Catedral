import { createClient } from '@supabase/supabase-js';

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

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    // Solo reseteamos general_info, los items se recargan desde la BD
    const infoData = {
      id: 'default',
      phone: initialGeneralInfo.phone,
      email: initialGeneralInfo.email,
      address: initialGeneralInfo.address,
      map_url: initialGeneralInfo.mapUrl,
      schedule_es: initialGeneralInfo.scheduleEs,
      schedule_en: initialGeneralInfo.scheduleEn,
      whatsapp: initialGeneralInfo.whatsapp,
      instagram: initialGeneralInfo.instagram,
      facebook: initialGeneralInfo.facebook,
      whatsapp_group: initialGeneralInfo.whatsappGroup
    };

    await supabase.from('general_info').upsert(infoData);

    const state = {
      menuItems: [],
      galleryItems: [],
      generalInfo: initialGeneralInfo
    };

    return res.status(200).json({ success: true, message: 'Se ha restablecido el menú de fábrica.', state });
  } catch (err) {
    console.error('Error in /api/state/reset:', err);
    return res.status(500).json({ error: 'Error al restablecer los valores de fábrica.', details: String(err) });
  }
}

