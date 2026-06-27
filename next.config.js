//next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  // Aumentar límite de tamaño para subida de archivos
  serverRuntimeConfig: {
    maxBodySize: 100 * 1024 * 1024, // 100 MB (para videos)
  },
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

module.exports = nextConfig;
