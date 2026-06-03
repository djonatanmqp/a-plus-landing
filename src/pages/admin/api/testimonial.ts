import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, sanitizeSlug, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST({ request }: { request: Request }) {
  const cookies = parseCookies(request.headers.get("cookie"));
  if (!validateAdminToken(cookies[SESSION_COOKIE_NAME])) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Authentication+required",
      },
    });
  }

  const formData = await request.formData();
  const clientName = (formData.get("clientName") ?? "").toString().trim();
  const serviceType = (formData.get("serviceType") ?? "").toString().trim();
  const city = (formData.get("city") ?? "").toString().trim();
  const state = (formData.get("state") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();
  const monthValue = (formData.get("date") ?? "").toString().trim();

  if (!clientName || !serviceType || !city || !state || !message || !monthValue) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Fill+in+all+the+testimonial+details",
      },
    });
  }

  const beforeFile = formData.get("beforeImage") as any;
  const afterFile = formData.get("afterImage") as any;
  if (!beforeFile || !beforeFile.size || !afterFile || !afterFile.size) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Upload+both+before+and+after+images",
      },
    });
  }

  const dateString = `${monthValue}-01`;
  const slug = sanitizeSlug(`${clientName}-${serviceType}-${monthValue}`);
  const uploadsDir = path.join(process.cwd(), "public/uploads/testimonials", slug);
  await ensureDir(uploadsDir);

  const beforeExt = path.extname(beforeFile.name) || ".jpg";
  const afterExt = path.extname(afterFile.name) || ".jpg";
  const beforeName = `before${beforeExt}`;
  const afterName = `after${afterExt}`;

  const beforeDestination = path.join(uploadsDir, beforeName);
  const afterDestination = path.join(uploadsDir, afterName);

  await fs.writeFile(beforeDestination, Buffer.from(await beforeFile.arrayBuffer()));
  await fs.writeFile(afterDestination, Buffer.from(await afterFile.arrayBuffer()));

  const beforeImagePath = `testimonials/${slug}/${beforeName}`;
  const afterImagePath = `testimonials/${slug}/${afterName}`;

  const markdown = `---\nclientName: "${clientName.replace(/"/g, '\\"')}"\nserviceType: "${serviceType.replace(/"/g, '\\"')}"\ncity: "${city.replace(/"/g, '\\"')}"\nstate: "${state.replace(/"/g, '\\"')}"\nbeforeImage: "${beforeImagePath}"\nafterImage: "${afterImagePath}"\ndate: "${dateString}"\n---\n${message.replace(/\r\n?/g, "\n").trim()}\n`;
  const testimonialFile = path.join(process.cwd(), "src/content/testimonials", `${slug}.md`);
  await fs.writeFile(testimonialFile, markdown, "utf8");

  return new Response(null, {
    status: 303,
    headers: {
      location: "/admin?message=Testimonial+added+successfully!",
    },
  });
}
