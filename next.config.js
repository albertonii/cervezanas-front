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
    domains: [
      "randomuser.me",
      "kvdearmedajqvexxhmrk.supabase.co",
      "nzlovxxjnbrzfykphpaj.supabase.co",
      "images.unsplash.com",
      "tailwindui.com",
      "images.pexels.com",
      "i.ibb.co",
      "lh3.googleusercontent.com",
    ],
    formats: ["image/webp", "image/avif"],
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
