import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
//#region src/lib/admin.ts
try {
	const envPath = path.join(process.cwd(), ".env");
	await fs.access(envPath);
	(await fs.readFile(envPath, "utf8")).split(/\r?\n/).forEach((line) => {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
		const [key, ...rest] = trimmed.split("=");
		const value = rest.join("=").trim().replace(/^"|"$/g, "");
		if (process.env[key] === void 0) process.env[key] = value;
	});
} catch (e) {}
var ADMIN_USER = process.env.ADMIN_USER ?? "admin";
process.env.ADMIN_PASSWORD;
var SESSION_COOKIE_NAME = "a_plus_admin_session";
var SESSION_MAX_AGE = 604800;
var ADMIN_ALLOWED_EMAILS = (process.env.ADMIN_ALLOWED_EMAILS ?? "djonatanmqp@gmail.com,detlev@apluspaversgrass.com").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
function isAdminEmail(email) {
	if (!email) return false;
	const normalized = email.trim().toLowerCase();
	if (ADMIN_ALLOWED_EMAILS.includes(normalized)) return true;
	const adminUser = (ADMIN_USER ?? "").trim().toLowerCase();
	return adminUser.includes("@") && adminUser === normalized;
}
var COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET ?? "change-this-secret-to-a-long-random-value";
process.env.NODE_ENV;
var LOGIN_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS ?? 5);
var LOGIN_RATE_LIMIT_WINDOW_SECONDS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_SEC ?? 300);
var loginAttempts = /* @__PURE__ */ new Map();
function isLoginAllowed(key) {
	const now = Date.now();
	const entry = loginAttempts.get(key);
	if (!entry) return true;
	if (now - entry.firstAttempt > LOGIN_RATE_LIMIT_WINDOW_SECONDS * 1e3) {
		loginAttempts.delete(key);
		return true;
	}
	return entry.count < LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
}
function recordLoginAttempt(key, success) {
	const now = Date.now();
	const entry = loginAttempts.get(key);
	if (success) {
		loginAttempts.delete(key);
		return;
	}
	if (!entry || now - entry.firstAttempt > LOGIN_RATE_LIMIT_WINDOW_SECONDS * 1e3) {
		loginAttempts.set(key, {
			count: 1,
			firstAttempt: now
		});
		return;
	}
	loginAttempts.set(key, {
		count: entry.count + 1,
		firstAttempt: entry.firstAttempt
	});
}
function getLoginAttemptInfo(key) {
	const entry = loginAttempts.get(key);
	if (!entry) return {
		count: 0,
		remainingSeconds: LOGIN_RATE_LIMIT_WINDOW_SECONDS
	};
	const elapsed = Math.floor((Date.now() - entry.firstAttempt) / 1e3);
	return {
		count: entry.count,
		remainingSeconds: Math.max(0, LOGIN_RATE_LIMIT_WINDOW_SECONDS - elapsed)
	};
}
function parseCookies(cookieHeader) {
	const cookies = {};
	if (!cookieHeader) return cookies;
	cookieHeader.split(/;\s*/).forEach((cookie) => {
		const [name, ...rest] = cookie.split("=");
		if (!name || rest.length === 0) return;
		cookies[name] = decodeURIComponent(rest.join("="));
	});
	return cookies;
}
function createAdminToken(username) {
	const payload = `${username}:${Math.floor(Date.now() / 1e3) + SESSION_MAX_AGE}`;
	return `${payload}:${crypto.createHmac("sha256", COOKIE_SECRET).update(payload).digest("hex")}`;
}
function validateAdminToken(token) {
	if (!token) return false;
	const [username, expiresString, signature] = token.split(":");
	if (!username || !expiresString || !signature) return false;
	const expires = Number(expiresString);
	if (Number.isNaN(expires) || expires < Math.floor(Date.now() / 1e3)) return false;
	const expected = crypto.createHmac("sha256", COOKIE_SECRET).update(`${username}:${expires}`).digest("hex");
	try {
		const signatureBuffer = Buffer.from(signature, "hex");
		const expectedBuffer = Buffer.from(expected, "hex");
		if (signatureBuffer.length !== expectedBuffer.length) return false;
		return isAdminEmail(username) && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
	} catch {
		return false;
	}
}
//#endregion
export { isLoginAllowed as a, validateAdminToken as c, isAdminEmail as i, createAdminToken as n, parseCookies as o, getLoginAttemptInfo as r, recordLoginAttempt as s, SESSION_COOKIE_NAME as t };
