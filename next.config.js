/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Add global polyfill for FHEVM SDK
    config.plugins.push(
      new config.webpack.DefinePlugin({
        global: 'globalThis',
      })
    );
    
    return config;
  },
}

module.exports = nextConfig
