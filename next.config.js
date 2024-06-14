// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './src/lib/translations/i18n.ts',
);

module.exports = withNextIntl({
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  images: {
    formats: [
      'image/avif',
      'image/webp',
      'image/png',
      'image/jpg',
      'image/jpeg',
    ],
    domains: [
      'nzlovxxjnbrzfykphpaj.supabase.co',
      'randomuser.me',
      'kvdearmedajqvexxhmrk.supabase.co',
      'images.unsplash.com',
      'tailwindui.com',
      'images.pexels.com',
      'i.ibb.co',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        hostname: 'nzlovxxjnbrzfykphpaj.supabase.co',
        protocol: 'https',
        port: '*',
        pathname: '/storage/v1/object/public/**',
      },
      {
        hostname: 'tailwindui.com',
        protocol: 'https',
        port: '*',
        pathname: '/**',
      },
      {
        hostname: 'i.ibb.co',
        protocol: 'https',
        port: '*',
        pathname: '/**',
      },
    ],
    // cache optimized images for 60 seconds
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      {
        source: '/cart',
        destination: '/cart/shopping_basket',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// const sentryWebpackPluginOptions = {
//   org: 'sentry-devrel',
//   project: 'cervezanas',
//   silent: true,
// };

// const sentryOptions = {
//   widenClientFileUpload: true,
//   hideSourceMaps: true,
// };

module.exports = withBundleAnalyzer({});

// module.exports = withSentryConfig(sentryWebpackPluginOptions, sentryOptions);
