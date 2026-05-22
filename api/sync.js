import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hadbwpdcpimylcjqeoph.supabase.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZGJ3cGRjcGlteWxjanFlb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzcyMTksImV4cCI6MjA5NDg1MzIxOX0.Zrcz1RYUiUzSkQNAOHzb93vX2FpCwmMNylFtEPMzpBs'
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
          subcategory: item.subcategory,
          nameEs: item.name_es,
          nameEn: item.name_en,
          descEs: item.desc_es,
          descEn: item.desc_en,
          price: item.price,
          available: item.available
        })),
        galleryItems: (galleryRes.data || []).map((item) => ({
          id: item.id,
          category: item.category,
          imageSrc: item.image_url
        })),
        generalInfo: infoRes.data?.[0] || {}
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { menuItems, galleryItems, generalInfo } = req.body;

      if (menuItems) {
        await supabase.from('menu_items').upsert(
          menuItems.map((item) => ({
            id: item.id,
            category: item.category,
            subcategory: item.subcategory,
            name_es: item.nameEs,
            name_en: item.nameEn,
            desc_es: item.descEs,
            desc_en: item.descEn,
            price: item.price,
            available: item.available
          }))
        );
      }

      if (galleryItems) {
        await supabase.from('gallery_items').upsert(
          galleryItems.map((item) => ({
            id: item.id,
            category: item.category,
            image_url: item.imageSrc
          }))
        );
      }

      if (generalInfo) {
        await supabase.from('general_info').upsert({
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
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
