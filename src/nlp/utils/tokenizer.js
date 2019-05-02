const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

function tokenizeText(text, language) {
	const request = {
		content: text,
		type: 'PLAIN_TEXT',
		language: language
	}

	return client.analyzeSyntax({document: request});
}

module.exports.tokenizeText = tokenizeText;