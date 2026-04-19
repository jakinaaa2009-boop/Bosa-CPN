/** @type {import('next').NextConfig} */

const remotePatterns = [
  {
    protocol: "https",
    hostname: "picsum.photos",
    pathname: "/**",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "5000",
    pathname: "/uploads/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "5000",
    pathname: "/uploads/**",
  },
  /** Railway public API host pattern (receipt files under /uploads) */
  {
    protocol: "https",
    hostname: "**.up.railway.app",
    pathname: "/uploads/**",
  },
];

try {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) {
    const u = new URL(api);
    const protocol = u.protocol.replace(":", "");
    if (protocol === "http" || protocol === "https") {
      remotePatterns.push({
        protocol,
        hostname: u.hostname,
        port: u.port || undefined,
        pathname: "/uploads/**",
      });
    }
  }
} catch {
  /* ignore invalid NEXT_PUBLIC_API_URL at build */
}

/** Receipt images served from Cloudflare R2 public URL */
if (process.env.NEXT_PUBLIC_R2_IMAGE_HOSTNAME) {
  remotePatterns.push({
    protocol: "https",
    hostname: process.env.NEXT_PUBLIC_R2_IMAGE_HOSTNAME,
    pathname: "/**",
  });
}

/** Must match `useBrowserBackendProxy()` in lib/api.ts */
function useBackendProxyRewrite() {
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "false") return false;
  if (process.env.NEXT_PUBLIC_USE_API_PROXY === "true") return true;
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
  if (!raw || process.env.NODE_ENV !== "development") return false;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return false;
    return true;
  } catch {
    return false;
  }
}

/** Local `next dev`: proxy to remote HTTPS API so the browser never cross-origin fetches (no CORS). */
async function backendProxyRewrites() {
  if (!useBackendProxyRewrite()) return [];
  const target = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
  if (!target) return [];
  return [
    {
      source: "/backend-proxy/:path*",
      destination: `${target}/:path*`,
    },
  ];
}

const nextConfig = {
  images: {
    remotePatterns,
  },
  async rewrites() {
    return backendProxyRewrites();
  },
};

export default nextConfig;
