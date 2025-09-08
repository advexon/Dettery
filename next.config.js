/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13+
  
  // Exclude contracts directory from Next.js build
  webpack: (config, { isServer }) => {
    // Add rule to ignore contracts directory
    config.module.rules.push({
      test: /\.ts$/,
      include: /contracts/,
      loader: require.resolve('./ignore-loader.js'),
    });
    
    // Also ignore Solidity files
    config.module.rules.push({
      test: /\.sol$/,
      loader: require.resolve('./ignore-loader.js'),
    });
    
    return config;
  },
  
  // Exclude contracts from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Exclude contracts from ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'hooks', 'utils'],
  },
}

module.exports = nextConfig
