const {Translate} = require('@google-cloud/translate');
const apiKey = require('./googleTranslateAPIKey');

const translate = new Translate({
	projectId: apiKey.projectId
});

function translateText(tokenizedText, targetLanguage='en') {
	return translate.translate(tokenizedText, targetLanguage);
}

module.exports.translateText = translateText;