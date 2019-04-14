const {Translate} = require('@google-cloud/translate');
const apiKey = require('./googleTranslateAPIKey');

const translate = new Translate({
	projectId: apiKey.projectId
});

function detectLanguage(text) {
	return translate.detect(text);
}

module.exports.detectLanguage = detectLanguage;