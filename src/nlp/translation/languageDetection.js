const {TranslationServiceClient} = require('@google-cloud/translate').v3beta1;
const apiKey = require('./googleTranslateAPIKey');

const translationClient = new TranslationServiceClient();

module.exports.detectLanguage = function detectLanguage(text) {
	const request = {
		parent: translationClient.locationPath(apiKey.projectId, 'global'),
		contents: text
	};

	return translationClient.detectLanguage(request);
}
