const NextI18Next = require("next-i18next").default;
const path = require("path");

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: [
    "fr",
    "zh-HANT",
    "zh-HANS",
    "nl",
    "gu",
    "hi",
    "it",
    "ja",
    "ko",
    "pl",
    "pt",
    "ru",
    "es",
    "de"
  ],
  localePath: path.resolve("./public/locales"),
  ns: [
    "navbar",
  ], // Specify your namespaces here
  defaultNS: "navbar", // Set a default namespace
  fallbackNS: "navbar"
});

module.exports = NextI18NextInstance;
module.exports.default = NextI18NextInstance;
