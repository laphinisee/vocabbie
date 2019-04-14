const translate = require('./translation');
const tokenize = require('./tokenizer');

function processText(text, targetLanguage='en') {
	return tokenize.tokenizeText(text).then(result => {
		return result[0];
	}).then(result => {
		const sourceLanguage = result['language'];
		const tokens = result['tokens'];

		const tokenList = tokens.map(token => token['text']['content']);

		const translations = translate.translateText(tokenList, sourceLanguage);

		return Promise.all([sourceLanguage, tokens, translations]);
	}).then(result => {
		[ sourceLanguage, tokens, translationResult ] = result;

		const translations = translationResult[0];

		for (i = 0 ; i < tokens.length; i++) {
			tokens[i]['translation'] = translations[i];
		}

		return [sourceLanguage, tokens];
	})
}

module.exports.processText = processText;