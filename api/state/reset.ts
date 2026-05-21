import { createClient } from '@supabase/supabase-js';
import { initialMenuItems, initialGalleryItems, initialGeneralInfo } from '../../src/initialData.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    await supabase.from('menu_items').delete().neq('id', '');
    await supabase.from('gallery_items').delete().neq('id', '');

    const menuData = initialMenuItems.map((item) => ({
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

    const galleryData = initialGalleryItems.map((item) => ({
      id: item.id,
      category: item.category,
      image_url: item.imageSrc
    }));

    await supabase.from('menu_items').insert(menuData);
    await supabase.from('gallery_items').insert(galleryData);

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
      menuItems: initialMenuItems,
      galleryItems: initialGalleryItems,
      generalInfo: initialGeneralInfo
    };

    return res.status(200).json({ success: true, message: 'Se ha restablecido el menú de fábrica.', state });
  } catch (err) {
    console.error('Error in /api/state/reset:', err);
    return res.status(500).json({ error: 'Error al restablecer los valores de fábrica.', details: String(err) });
  }
}
