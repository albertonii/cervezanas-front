// i18n
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .init({
//     lng: "es", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
//     // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
//     // if you're using a language detector, do not define the lng option
//     interpolation: {
//       escapeValue: false, // react already safes from xss
//     },
//     fallbackLng: "en",
//     supportedLngs: ["en", "es"],
//     fallbackNS: "translation",
//     ns: ["translation"],
//     defaultNS: "translation",
//   });

// export default i18n;

export const i18n = {
  defaultLocale: "es",
  locales: ["es", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

// import { getRequestConfig } from "next-intl/server";

// export default getRequestConfig(async ({ locale }) => ({
//   messages: (await import(`./messages/${locale}.json`)).default,
// }));
