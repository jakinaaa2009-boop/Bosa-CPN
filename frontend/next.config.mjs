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

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
