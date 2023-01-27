/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "randomuser.me",
      "kvdearmedajqvexxhmrk.supabase.co",
      "images.unsplash.com",
      "tailwindui.com",
      "images.pexels.com",
    ],
    formats: ["image/webp", "image/avif"],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US", "es-ES"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "es-ES",
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
    /*
    domains: [
      {
        domain: "example.com",
        defaultLocale: "en-US",
      },
      {
        domain: "example.nl",
        defaultLocale: "nl-NL",
      },
      {
        domain: "example.fr",
        defaultLocale: "fr",
        // an optional http field can also be used to test
        // locale domains locally with http instead of https
        http: true,
      },
    ],
    */
  },
};
