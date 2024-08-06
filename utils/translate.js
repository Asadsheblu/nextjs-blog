// utils/translate.js
const translate = require('translate-google');

async function translateText(text, targetLanguage) {
  try {
    const translation = await translate(text, { to: targetLanguage });
    return translation;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}

module.exports = translateText;
