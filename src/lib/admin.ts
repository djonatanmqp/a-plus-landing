import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Str0ngP@ssw0rd!2026";
const COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET ?? "change-this-secret-to-a-long-random-value";
export const SESSION_COOKIE_NAME = "a_plus_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

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
  return username === ADMIN_USER && signature === expected;
}

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readServicesConfig() {
  const filePath = path.join(process.cwd(), "src/data/services.json");
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function writeServicesConfig(config: unknown) {
  const filePath = path.join(process.cwd(), "src/data/services.json");
  await fs.writeFile(filePath, JSON.stringify(config, null, 2) + "\n", "utf8");
}

export async function listTestimonials() {
  const testimonialsDir = path.join(process.cwd(), "src/content/testimonials");
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
