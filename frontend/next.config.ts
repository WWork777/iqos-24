// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "217.198.9.128",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development", // опционально для разработки
  },
  experimental: {
    serverComponents: false,
    appDir: false,
    rsc: false,
  },

  // 2. Заголовки безопасности
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // 3. Конфигурация безопасности сборки
  poweredByHeader: false,
  generateEtags: true,

  // 4. Ограничение размеров загружаемых файлов
  serverRuntimeConfig: {
    maxRequestBodySize: "10mb",
  },

  // 5. Включение сжатия
  compress: true,

  // 6. Настройка перенаправлений для защиты
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/login",
        permanent: false,
      },
    ];
  },

  // 7. CSP через Report-Only (настройте под свое приложение)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/_next/static/chunks/rsc",
          has: [
            {
              type: "header",
              key: "x-rsc-validator",
              value: ".+",
            },
          ],
          destination: "/_next/static/chunks/rsc",
        },
      ],
    };
  },
};

export default nextConfig;
