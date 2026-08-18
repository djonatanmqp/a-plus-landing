-- 1. Tabela de Serviços
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    short_description TEXT,
    description TEXT,
    highlights TEXT[],
    hero_image TEXT,
    cover_image TEXT,
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