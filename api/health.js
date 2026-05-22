const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hadbwpdcpimylcjqeoph.supabase.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZGJ3cGRjcGlteWxjanFlb3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzcyMTksImV4cCI6MjA5NDg1MzIxOX0.Zrcz1RYUiUzSkQNAOHzb93vX2FpCwmMNylFtEPMzpBs'
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Test basic Supabase connectivity
    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .select('count', { count: 'exact' });

    if (menuError) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to query menu_items',
        error: menuError.message,
        code: menuError.code
      });
    }

    const { data: galleryData, error: galleryError } = await supabase
      .from('gallery_items')
      .select('count', { count: 'exact' });

    if (galleryError) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to query gallery_items',
        error: galleryError.message,
        code: galleryError.code
      });
    }

    const { data: infoData, error: infoError } = await supabase
      .from('general_info')
      .select('count', { count: 'exact' });

    if (infoError) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to query general_info',
        error: infoError.message,
        code: infoError.code
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Supabase connection OK',
      tables: {
        menu_items: menuData,
        gallery_items: galleryData,
        general_info: infoData
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Exception during health check',
      error: error.message
    });
  }
};
