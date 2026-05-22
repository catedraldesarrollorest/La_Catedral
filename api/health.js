import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hadbwpdcpimylcjqeoph.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZGJ3cGRjcGlteWxjanFlb3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTI3NzIxOSwiZXhwIjoyMDk0ODUzMjE5fQ.4gs0q1DnYRg_TaV5CzXhzBH4xVAppldo8YfH5iV0Wf4'
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    console.log('Health check started');
    console.log('Supabase URL:', 'https://hadbwpdcpimylcjqeoph.supabase.com');

    // Test basic Supabase connectivity
    console.log('Attempting to query menu_items...');
    const { data: menuData, error: menuError, count: menuCount } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    console.log('Menu query response:', { error: menuError, count: menuCount });

    if (menuError) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to query menu_items',
        error: menuError.message,
        code: menuError.code,
        details: menuError
      });
    }

    const { data: galleryData, error: galleryError, count: galleryCount } = await supabase
      .from('gallery_items')
      .select('*', { count: 'exact', head: true });

    if (galleryError) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to query gallery_items',
        error: galleryError.message,
        code: galleryError.code
      });
    }

    const { data: infoData, error: infoError, count: infoCount } = await supabase
      .from('general_info')
      .select('*', { count: 'exact', head: true });

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
        menu_items: menuCount,
        gallery_items: galleryCount,
        general_info: infoCount
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
