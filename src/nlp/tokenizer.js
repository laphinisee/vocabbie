const language = require('@google-cloud/language');
const apiKey = require('./googleTranslateAPIKey');

const client = new language.LanguageServiceClient({
	projectId: apiKey.projectId
});

function tokenizeText(text) {
	const request = {
		content: text,
		type: 'PLAIN_TEXT'
	}

	return client.analyzeSyntax({document: request});
}

module.exports.tokenizeText = tokenizeText;