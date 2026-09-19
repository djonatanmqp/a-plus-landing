-- 1. Tabela de Serviços
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    short_description TEXT,
    description TEXT,
    highlights TEXT[],
    main_image TEXT,
    images TEXT[],
    faq JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Configurações da Empresa (Settings/Company)
CREATE TABLE settings (
    id TEXT PRIMARY KEY DEFAULT 'company',
    name TEXT,
    tagline TEXT,
    address JSONB,
    contact JSONB,
    links JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Depoimentos (Testimonials)
CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    name TEXT,
    location TEXT,
    text TEXT,
    rating INTEGER,
    service TEXT,
    date TEXT,
    before_image TEXT,
    after_image TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela de FAQ Geral
CREATE TABLE faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Adiciona a coluna display_order se ela ainda não existir
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Migra imagens existentes para a coluna única usada pelo site.
ALTER TABLE services ADD COLUMN IF NOT EXISTS main_image TEXT;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'hero_image')
       OR EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'cover_image') THEN
        EXECUTE 'UPDATE services SET main_image = COALESCE(main_image, hero_image, cover_image) WHERE main_image IS NULL';
    END IF;
END $$;
ALTER TABLE services DROP COLUMN IF EXISTS hero_image;
ALTER TABLE services DROP COLUMN IF EXISTS cover_image;

-- Atualiza a ordem dos serviços existentes de forma segura e organizada
UPDATE services SET display_order = 1 WHERE title ILIKE '%Driveways%';
UPDATE services SET display_order = 2 WHERE title ILIKE '%Patios & Walkways%';
UPDATE services SET display_order = 3 WHERE title ILIKE '%Pool Decks%';
UPDATE services SET display_order = 4 WHERE title ILIKE '%Pergolas & Summer Kitchens%';
UPDATE services SET display_order = 5 WHERE title ILIKE '%Artificial Turf & Sod%';
UPDATE services SET display_order = 10 WHERE title ILIKE '%Others%' OR title ILIKE '%Outros%';