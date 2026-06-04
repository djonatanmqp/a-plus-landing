import servicesData from "../data/services.json";

export async function GET({ request }: { request: Request }) {
  const baseUrl = process.env.SITE_URL || new URL(request.url).origin;
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/services`,
    ...servicesData.map((service) => `${baseUrl}/services/${service.id}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) =>
      `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${loc === `${baseUrl}/` ? "1.0" : "0.8"}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml;charset=UTF-8",
    },
  });
}
