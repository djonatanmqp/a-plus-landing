import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Caminho correto apontando para a mesma pasta do script (src/scripts/services.json)
const jsonPath = path.join(__dirname, 'services.json');
const rawData = fs.readFileSync(jsonPath, 'utf-8');
const services = JSON.parse(rawData);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Função auxiliar para otimizar com Sharp e converter em Base64 WebP
async function imageToWebpBase64(filePath: string): Promise<string | null> {
  try {
    if (fs.existsSync(filePath)) {
      const optimizedBuffer = await sharp(filePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      return `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
    }
  } catch (err) {
    console.warn(`Aviso ao processar imagem ${filePath}:`, err);
  }
  return null;
}

async function runMigration() {
  try {
    // 2. Lê o services.json que agora está dentro de src/scripts/
    const jsonPath = path.join(__dirname, 'services.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const services = JSON.parse(rawData);

    for (const service of services) {
      if (service.id === 'driveways') {
        console.log(`Pulando o serviço: driveways (preservado).`);
        continue;
      }

      console.log(`Processando migração para: ${service.id} (${service.title})...`);

      const serviceDir = path.join(process.cwd(), 'public', 'assets', 'services', service.id);

      const heroPathWebp = path.join(serviceDir, `${service.id}-hero.webp`);
      const heroPathJpg = path.join(serviceDir, `${service.id}-hero.jpg`);
      const heroPathPng = path.join(serviceDir, `${service.id}-hero.png`);
      const heroFile = fs.existsSync(heroPathWebp) ? heroPathWebp : (fs.existsSync(heroPathJpg) ? heroPathJpg : (fs.existsSync(heroPathPng) ? heroPathPng : null));
      
      const coverPathWebp = path.join(serviceDir, `${service.id}-cover.webp`);
      const coverPathJpg = path.join(serviceDir, `${service.id}-cover.jpg`);
      const coverPathPng = path.join(serviceDir, `${service.id}-cover.png`);
      const coverFile = fs.existsSync(coverPathWebp) ? coverPathWebp : (fs.existsSync(coverPathJpg) ? coverPathJpg : (fs.existsSync(coverPathPng) ? coverPathPng : null));

      const heroImageBase64 = heroFile ? await imageToWebpBase64(heroFile) : (service.heroImage || null);
      const coverImageBase64 = coverFile ? await imageToWebpBase64(coverFile) : (service.coverImage || null);

      const galleryImagesBase64: string[] = [];
      if (fs.existsSync(serviceDir)) {
        const files = fs.readdirSync(serviceDir);
        const galleryFiles = files.filter(file => 
          file.startsWith(`${service.id}-`) && 
          /\d+/.test(file) && 
          !file.includes('hero') && 
          !file.includes('cover')
        ).sort();

        for (const gFile of galleryFiles) {
          const fullPath = path.join(serviceDir, gFile);
          const b64 = await imageToWebpBase64(fullPath);
          if (b64) {
            galleryImagesBase64.push(b64);
          }
        }
      }

      const updateData: any = {
        id: service.id,
        title: service.title || '',
        subtitle: service.tagline || service.subtitle || '',
        shortDescription: service.description || '',
        description: service.details || service.description || '',
        bulletPoints: Array.isArray(service.features) ? service.features : (service.bulletPoints || []),
        heroImage: heroImageBase64 || '',
        coverImage: coverImageBase64 || '',
        galleryImages: galleryImagesBase64.length > 0 ? galleryImagesBase64 : [],
        updatedAt: new Date().toISOString()
      };

      await db.collection('services').doc(service.id).set(updateData, { merge: true });
      console.log(`> Sucesso ao migrar serviço: ${service.id}`);

      if (Array.isArray(service.faq) && service.faq.length > 0) {
        console.log(`> Cadastrando FAQs para ${service.id}...`);
        for (const item of service.faq) {
          await db.collection('faqs').add({
            question: item.question,
            answer: item.answer,
            serviceId: service.id,
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    console.log('Migração de serviços e FAQs concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  }
}

runMigration();