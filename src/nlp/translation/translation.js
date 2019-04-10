const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;
const apiKey = require('./googleTranslateAPIKey');

const translationClient = new TranslationServiceClient();

module.exports.translateText = function translateText(tokenizedText, sourceLanguage, targetLanguage='en-US') {
	const request = {
		parent: translationClient.locationPath(apiKey.projectId, 'global'),
		contents: tokenizedText,
		mimeType: 'text/plain',
		sourceLanguageCode: sourceLanguage,
		targetLanguageCode: targetLanguage
	};

	return translationClient.translateText(request);
}
