import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

// Inicializa o Firebase Admin usando as credenciais do seu .env
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Corrige quebras de linha na chave privada caso venham escapadas
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
  })
});

const db = getFirestore();

// ⚠️ COLOQUE AQUI AS SUAS CREDENCIAIS DO SUPABASE (Project Settings > API)
const SUPABASE_URL = 'https://viapfzzkfniawogmmdny.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_ngCxdpcSJlbAmbWz94uzPg_TqHF_StY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
  console.log('🚀 Iniciando migração do Firebase para o Supabase...\n');

  try {
    // 1. Migrar Services
    const servicesSnapshot = await db.collection('services').get();
    for (const doc of servicesSnapshot.docs) {
      const data = doc.data();
      const { error } = await supabase.from('services').upsert({
        id: doc.id,
        title: data.title,
        subtitle: data.subtitle,
        short_description: data.shortDescription,
        description: data.description,
        highlights: data.highlights || [],
        main_image: data.mainImage || data.heroImage || data.coverImage,
        images: data.images || [],
        faq: data.faq || []
      });
      if (error) console.error(`Erro no serviço ${doc.id}:`, error.message);
    }
    console.log(`[OK] Serviços processados: ${servicesSnapshot.size} documentos.`);

    // 2. Migrar Company (Settings)
    const companyDoc = await db.collection('settings').doc('company').get();
    if (companyDoc.exists) {
      const data = companyDoc.data();
      const { error } = await supabase.from('settings').upsert({
        id: 'company',
        name: data.name,
        tagline: data.tagline,
        address: data.address || {},
        contact: data.contact || {},
        links: data.links || {}
      });
      if (error) console.error('Erro na company:', error.message);
      else console.log('[OK] Configurações da empresa (Company) migradas.');
    }

    // 3. Migrar Testimonials
    try {
      const testimonialsSnapshot = await db.collection('testimonials').get();
      for (const doc of testimonialsSnapshot.docs) {
        const data = doc.data();
        await supabase.from('testimonials').upsert({
          id: doc.id,
          name: data.name,
          location: data.location,
          text: data.text,
          rating: data.rating,
          service: data.service,
          date: data.date,
          before_image: data.beforeImage,
          after_image: data.afterImage
        });
      }
      console.log(`[OK] Depoimentos processados: ${testimonialsSnapshot.size} documentos.`);
    } catch (e) {
      console.log('[Info] Coleção testimonials não encontrada.');
    }

    // 4. Migrar FAQ Geral
    const faqSnapshot = await db.collection('faq').get();
    for (const doc of faqSnapshot.docs) {
      const data = doc.data();
      await supabase.from('faqs').upsert({
        id: doc.id,
        question: data.question,
        answer: data.answer,
        category: data.category || null
      });
    }
    console.log(`[OK] FAQs gerais processadas: ${faqSnapshot.size} documentos.`);

    console.log('\n✨ Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro crítico durante a migração:', error);
  }
}

runMigration();