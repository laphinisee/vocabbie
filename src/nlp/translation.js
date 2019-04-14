const {Translate} = require('@google-cloud/translate');
const apiKey = require('./googleTranslateAPIKey');

const translate = new Translate({
	projectId: apiKey.projectId
});

function translateText(tokenizedText, sourceLanguage, targetLanguage='en') {
	const options = {
		from: sourceLanguage,
		to: targetLanguage
	};
	
	return translate.translate(tokenizedText, options);
}

module.exports.translateText = translateText;