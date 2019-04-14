const translate = require('./translation');
const tokenize = require('./tokenizer');
const sw = require('stopword');

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
		const stopwords = sw[sourceLanguage];

		let word, isPunctuation;
		for (i = 0 ; i < tokens.length; i++) {
			tokens[i]['translation'] = translations[i];

			if (stopwords) {
				lemma = tokens[i]['lemma'];
				isPunctuation = tokens[i]['partOfSpeech']['tag']
				tokens[i]['isStopword'] = stopwords.includes(lemma) || isPunctuation === 'PUNCT';

				console.log(lemma, isPunctuation, tokens[i]['isStopword']);
			}
		}

		return [sourceLanguage, tokens];
	})
}

module.exports.processText = processText;

// let translation = processText('我是一個漂亮的蝴蝶。')
// let translation = processText('hola.\ncomo estas?')
// translation.then(result => console.log(result[1]));