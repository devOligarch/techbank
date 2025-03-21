const { Client, cacheExchange, fetchExchange } = require("@urql/core");
const fs = require("fs");

const GET_VARIANTS = `
query Query {
  getVariants {  
    id
  }
}
`;

const client = new Client({
  url: "https://techbank-backend.vercel.app/",
  exchanges: [cacheExchange, fetchExchange],
});

async function generateSitemap() {
  const { data } = await client.query(GET_VARIANTS);

  console.log(data);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
          <loc>https://tech-bank-ke.vercel.app/</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://tech-bank-ke.vercel.app/all</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://tech-bank-ke.vercel.app/new-tradein</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.9</priority>
        </url>    
      ${data?.getVariants
        ?.map((variant) => {
          return `
        <url>
          <loc>https://tech-bank-ke.vercel.app/product/${variant?.id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>0.9</priority>
        </url>
      `;
        })
        .join("")}
    </urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
}

generateSitemap();
