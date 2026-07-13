import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// Carrega `.env` manualmente se as variáveis de ambiente não estiverem presentes.
// Isso ajuda em ambientes onde o processo não carregou o .env automaticamente.
try {
  const envPath = path.join(process.cwd(), ".env");
  // top-level await: ler arquivo e popular process.env se necessário
  await fs.access(envPath);
  const raw = await fs.readFile(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^"|"$/g, "");
    if (process.env[key] === undefined) process.env[key] = value;
  });
} catch (e) {
  // arquivo .env não encontrado ou erro de leitura — sem ação
}

export const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Str0ngP@ssw0rd!2026";
export const SESSION_COOKIE_NAME = "a_plus_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET ?? "change-this-secret-to-a-long-random-value";
const COOKIE_SECURE = process.env.NODE_ENV === "production";
export const SESSION_COOKIE_FLAGS = `Path=/admin; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${COOKIE_SECURE ? "; Secure" : ""}`;
export const SESSION_COOKIE_DELETE_FLAGS = `Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0${COOKIE_SECURE ? "; Secure" : ""}`;
const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS ?? 5);
const LOGIN_RATE_LIMIT_WINDOW_SECONDS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_SEC ?? 300);
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function isLoginAllowed(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry) return true;
  if (now - entry.firstAttempt > LOGIN_RATE_LIMIT_WINDOW_SECONDS * 1000) {
    loginAttempts.delete(key);
    return true;
  }
  return entry.count < LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
}

export function recordLoginAttempt(key: string, success: boolean) {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (success) {
    loginAttempts.delete(key);
    return;
  }
  if (!entry || now - entry.firstAttempt > LOGIN_RATE_LIMIT_WINDOW_SECONDS * 1000) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return;
  }
  loginAttempts.set(key, { count: entry.count + 1, firstAttempt: entry.firstAttempt });
}

export function getLoginAttemptInfo(key: string) {
  const entry = loginAttempts.get(key);
  if (!entry) return { count: 0, remainingSeconds: LOGIN_RATE_LIMIT_WINDOW_SECONDS };
  const elapsed = Math.floor((Date.now() - entry.firstAttempt) / 1000);
  return {
    count: entry.count,
    remainingSeconds: Math.max(0, LOGIN_RATE_LIMIT_WINDOW_SECONDS - elapsed),
  };
}

export function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(/;\s*/).forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (!name || rest.length === 0) return;
    cookies[name] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

export function createAdminToken(username: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${username}:${expires}`;
  const signature = crypto.createHmac("sha256", COOKIE_SECRET).update(payload).digest("hex");
  return `${payload}:${signature}`;
}

export function validateAdminToken(token?: string) {
  if (!token) return false;
  const [username, expiresString, signature] = token.split(":");
  if (!username || !expiresString || !signature) return false;
  const expires = Number(expiresString);
  if (Number.isNaN(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const expected = crypto.createHmac("sha256", COOKIE_SECRET).update(`${username}:${expires}`).digest("hex");
  try {
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return username === ADMIN_USER && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

// 🚀 AJUSTE GODADDY: Caminho persistente para o arquivo de configurações de serviços
const SERVICES_PERSISTENT_PATH = path.join(process.cwd(), "public/assets/services.json");
const SERVICES_FALLBACK_PATH = path.join(process.cwd(), "src/data/services.json");

export async function readServicesConfig() {
  try {
    // Tenta ler o arquivo da pasta de assets persistentes da GoDaddy
    const raw = await fs.readFile(SERVICES_PERSISTENT_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    // Se o arquivo persistente não existir (ex: primeiro deploy), migra o estático antigo ou inicia um novo
    try {
      const fallbackRaw = await fs.readFile(SERVICES_FALLBACK_PATH, "utf8");
      const config = JSON.parse(fallbackRaw);
      // Salva a cópia no novo local persistente de forma automática
      await ensureDir(path.dirname(SERVICES_PERSISTENT_PATH));
      await fs.writeFile(SERVICES_PERSISTENT_PATH, JSON.stringify(config, null, 2) + "\n", "utf8");
      return config;
    } catch {
      return [];
    }
  }
}

export async function writeServicesConfig(config: unknown) {
  await ensureDir(path.dirname(SERVICES_PERSISTENT_PATH));
  await fs.writeFile(SERVICES_PERSISTENT_PATH, JSON.stringify(config, null, 2) + "\n", "utf8");
}

// 🚀 AJUSTE GODADDY: Listar depoimentos lendo direto do diretório persistente
export async function listTestimonials() {
  const testimonialsDir = path.join(process.cwd(), "public/assets/content/testimonials");
  await ensureDir(testimonialsDir);
  const entries = await fs.readdir(testimonialsDir);
  return entries.filter((name) => name.endsWith(".md")).sort();
}

export function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "testimonial";
}