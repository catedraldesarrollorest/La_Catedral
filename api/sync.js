import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hadbwpdcpimylcjqeoph.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZGJ3cGRjcGlteWxjanFlb3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI3NzIxOSwiZXhwIjoyMDk0ODUzMjE5fQ.4gs0q1DnYRg_TaV5CzXhzBH4xVAppldo8YfH5iV0Wf4'
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const [menuRes, galleryRes, infoRes] = await Promise.all([
        supabase.from('menu_items').select('*'),
        supabase.from('gallery_items').select('*'),
        supabase.from('general_info').select('*').eq('id', 'default')
      ]);

      return res.status(200).json({
        menuItems: (menuRes.data || []).map((item) => ({
          id: item.id,
          category: item.category,
          nameEs: item.name_es,
          nameEn: item.name_en,
          descEs: item.description_es,
          descEn: item.description_en,
          price: item.price.toString(),
          available: item.is_available,
          imageSrc: item.image_url
        })),
        galleryItems: (galleryRes.data || []).map((item) => ({
          id: item.id,
          category: item.category,
          imageSrc: item.image_url
        })),
        generalInfo: infoRes.data?.[0] ? {
          phone: infoRes.data[0].phone,
          email: infoRes.data[0].email,
          address: infoRes.data[0].address,
          mapUrl: infoRes.data[0].map_url,
          scheduleEs: infoRes.data[0].schedule_es,
          scheduleEn: infoRes.data[0].schedule_en,
          whatsapp: infoRes.data[0].whatsapp,
          instagram: infoRes.data[0].instagram,
          facebook: infoRes.data[0].facebook,
          whatsappGroup: infoRes.data[0].whatsapp_group
        } : {}
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { menuItems, galleryItems, generalInfo } = req.body;

      if (menuItems && menuItems.length > 0) {
        const { error: menuError } = await supabase.from('menu_items').upsert(
          menuItems.map((item) => ({
            id: item.id,
            category: item.category,
            name_es: item.nameEs,
            name_en: item.nameEn,
            description_es: item.descEs,
            description_en: item.descEn,
            price: parseFloat(item.price),
            is_available: item.available,
            image_url: item.imageSrc || null
          }))
        );
        if (menuError) {
          console.error('Menu items upsert error:', menuError);
          return res.status(500).json({ error: `Menu items error: ${menuError.message}` });
        }
      }

      if (galleryItems && galleryItems.length >= 0) {
        // Delete all existing gallery items first
        await supabase.from('gallery_items').delete().neq('id', '');

        // Then insert the new ones
        if (galleryItems.length > 0) {
          const { error: galleryError } = await supabase.from('gallery_items').upsert(
            galleryItems.map((item) => ({
              id: item.id,
              category: item.category,
              image_url: item.imageSrc
            }))
          );
          if (galleryError) {
            console.error('Gallery items upsert error:', galleryError);
            return res.status(500).json({ error: `Gallery items error: ${galleryError.message}` });
          }
        }
      }

      if (generalInfo && Object.keys(generalInfo).length > 0) {
        const { error: infoError } = await supabase.from('general_info').upsert({
          id: 'default',
          phone: generalInfo.phone,
          email: generalInfo.email,
          address: generalInfo.address,
          map_url: generalInfo.mapUrl,
          schedule_es: generalInfo.scheduleEs,
          schedule_en: generalInfo.scheduleEn,
          whatsapp: generalInfo.whatsapp,
          instagram: generalInfo.instagram,
          facebook: generalInfo.facebook,
          whatsapp_group: generalInfo.whatsappGroup
        });
        if (infoError) {
          console.error('General info upsert error:', infoError);
          return res.status(500).json({ error: `General info error: ${infoError.message}` });
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
