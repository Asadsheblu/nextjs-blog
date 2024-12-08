const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['learnmethods.com','doppcall.com','localhost'], // Add your allowed domains here
  },
};
