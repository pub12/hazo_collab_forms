/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hazo_collab_forms', 'hazo_auth', 'hazo_chat', 'hazo_connect'],
  webpack: (config, { isServer }) => {
    const path = require('path');
    
    // Add alias to resolve 'hazo_chat' subpath exports from the root node_modules
    // Note: We don't alias the main 'hazo_chat' to allow package.json exports to work
    const hazoChatPath = path.resolve(__dirname, '../node_modules/hazo_chat');
    config.resolve.alias = {
      ...config.resolve.alias,
      'hazo_chat/api': path.resolve(hazoChatPath, 'dist/api/index.js'),
      'hazo_chat/components': path.resolve(hazoChatPath, 'dist/components/index.js'),
      'hazo_chat/lib': path.resolve(hazoChatPath, 'dist/lib/index.js'),
    };
    
    // Ensure hazo_chat can be resolved from parent node_modules
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../node_modules'),
    ];

    // Fixes "Module not found: Can't resolve 'fs'" error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Exclude native modules and sql.js from bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
        'sql.js': 'commonjs sql.js',
      });
    } else {
      // For client-side, mark these as external to prevent bundling
      config.resolve.alias = {
        ...config.resolve.alias,
        'better-sqlite3': false,
        'sql.js': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;

