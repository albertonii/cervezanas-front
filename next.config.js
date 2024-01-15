// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextIntl = require("next-intl/plugin")(
  "./src/lib/translations/i18n.ts"
);

module.exports = withNextIntl({
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  images: {
    formats: [
      "image/avif",
      "image/webp",
      "image/png",
      "image/jpg",
      "image/jpeg",
    ],
    domains: [
      "nzlovxxjnbrzfykphpaj.supabase.co",
      "randomuser.me",
      "kvdearmedajqvexxhmrk.supabase.co",
      "images.unsplash.com",
      "tailwindui.com",
      "images.pexels.com",
      "i.ibb.co",
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        hostname: "nzlovxxjnbrzfykphpaj.supabase.co",
        protocol: "https",
        port: "*",
        pathname: "/storage/v1/object/public/**",
      },
      {
        hostname: "tailwindui.com",
        protocol: "https",
        port: "*",
        pathname: "/**",
      },
      {
        hostname: "i.ibb.co",
        protocol: "https",
        port: "*",
        pathname: "/**",
      },
    ],
    // cache optimized images for 60 seconds
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      {
        source: "/cart",
        destination: "/cart/shopping_basket",
        permanent: true,
      },
    ];
  },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});
