/**
 * The single source of the deployment origin.
 *
 * Every absolute URL on the site (metadataBase, OG/Twitter card images)
 * resolves through here. `NEXT_PUBLIC_SITE_URL` is inlined by the bundler at
 * BUILD time and every route is statically prerendered, so this value has to
 * be present in the build environment — a runtime-only variable (a Cloudflare
 * Worker binding, a Vercel runtime env) arrives after the HTML is already
 * frozen. See .env.example.
 *
 * The platform fallbacks below are read server-side during the metadata pass,
 * so they do not need the NEXT_PUBLIC_ prefix. They keep preview deployments
 * pointing at themselves instead of at localhost when the explicit variable
 * is missing.
 */
function withProtocol(host: string): string {
  const trimmed = host.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return withProtocol(explicit);

  // Vercel: the production domain, available to the build.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return withProtocol(vercel);

  // Cloudflare Pages: the deployment URL, available to the build.
  const cloudflare = process.env.CF_PAGES_URL;
  if (cloudflare) return withProtocol(cloudflare);

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
