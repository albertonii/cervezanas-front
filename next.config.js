// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextIntl = require("next-intl/plugin")(
  // This is the default (also the `src` folder is supported out of the box)
  "./src/lib/translations/i18n.ts"
);

module.exports = withNextIntl({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },

  images: {
    domains: [
      "randomuser.me",
      "kvdearmedajqvexxhmrk.supabase.co",
      "nzlovxxjnbrzfykphpaj.supabase.co",
      "images.unsplash.com",
      "tailwindui.com",
      "images.pexels.com",
      "i.ibb.co",
    ],
    formats: ["image/webp", "image/avif"],
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
