/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Add polyfills for FHEVM SDK
    config.plugins.push(
      new webpack.DefinePlugin({
        global: 'globalThis',
        self: 'globalThis',
      })
    );
    
    return config;
  },
}

module.exports = nextConfig
