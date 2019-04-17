const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

function tokenizeText(text) {
	const request = {
		content: text,
		type: 'PLAIN_TEXT'
	}

	return client.analyzeSyntax({document: request});
}

module.exports.tokenizeText = tokenizeText;