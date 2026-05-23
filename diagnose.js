#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
  console.log('\n🔍 DIAGNOSTICO DE BASE DE DATOS\n');
  console.log('=' .repeat(60));

  try {
    // Query all menu items
    console.log('\n📋 CONSULTANDO TABLA: menu_items');
    const { data, error } = await supabase.from('menu_items').select('*');

    if (error) {
      console.error('❌ Error querying menu_items:', error);
      return;
    }

    console.log(`✅ Total de items: ${data?.length || 0}\n`);

    if (!data || data.length === 0) {
      console.log('⚠️  LA TABLA menu_items ESTÁ VACÍA');
      console.log('Necesito crear datos de prueba...\n');
      return;
    }

    // Show first 3 items
    console.log('📦 PRIMEROS 3 ITEMS:\n');
    data.slice(0, 3).forEach((item, idx) => {
      console.log(`[${idx + 1}]`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Category: ${item.category}`);
      console.log(`  Subcategory: ${item.subcategory || '(VACIO)'}`);
      console.log(`  Name ES: ${item.name_es || '(VACIO)'}`);
      console.log(`  Name EN: ${item.name_en || '(VACIO)'}`);
      console.log(`  Desc ES: ${item.desc_es ? item.desc_es.substring(0, 50) + '...' : '(VACIO)'}`);
      console.log(`  Price: ${item.price || '(VACIO)'}`);
      console.log(`  Available: ${item.available}`);
      console.log('');
    });

    // Check for missing fields
    console.log('🔎 VALIDACIÓN DE CAMPOS:\n');
    const issues = [];
    data.forEach((item, idx) => {
      const missing = [];
      if (!item.id) missing.push('id');
      if (!item.category) missing.push('category');
      if (!item.name_es) missing.push('name_es');
      if (!item.name_en) missing.push('name_en');
      if (!item.price) missing.push('price');

      if (missing.length > 0) {
        issues.push({ idx, id: item.id, missing });
      }
    });

    if (issues.length > 0) {
      console.log(`⚠️  ENCONTRADOS ${issues.length} ITEMS CON CAMPOS FALTANTES:\n`);
      issues.forEach(issue => {
        console.log(`  Item ${issue.idx} (${issue.id}): Falta ${issue.missing.join(', ')}`);
      });
    } else {
      console.log('✅ TODOS LOS ITEMS TIENEN LOS CAMPOS REQUERIDOS');
    }

    console.log('\n' + '='.repeat(60) + '\n');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

diagnose();
