const translate = require('./translation');
const tokenize = require('./tokenizer');
const pronunciation = require('./pronunciation');
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
		const pronunciations = [];

		let token, word, isPunctuation;
		for (i = 0; i < tokens.length; i++) {
			token = tokens[i];
			word = token['text']['content'];
			token['translation'] = translations[i];

			if (stopwords) {
				lemma = token['lemma'];
				isPunctuation = token['partOfSpeech']['tag']
				token['isStopword'] = stopwords.includes(lemma) || isPunctuation === 'PUNCT';
			}

			if (pronunciation.supportedLanguages.includes(sourceLanguage)) {
				pronunciations.push(pronunciation.getPronunciation(word, sourceLanguage));
			}
		}

		return Promise.all([sourceLanguage, tokens, Promise.all(pronunciations)]);
	}).then(result => {
		[ sourceLanguage, tokens, pronunciations ] = result;

		if (!pronunciation.supportedLanguages.includes(sourceLanguage)) {
			return [sourceLanguage, tokens]
		}

		for (i = 0; i < tokens.length; i++) {
			tokens[i]['pronunciation'] = pronunciations[i];
		}
		
		return [sourceLanguage, tokens];
	})
}

module.exports.processText = processText;

let translation = processText('我是一個漂亮的蝴蝶。')
// let translation = processText('hola.\ncomo estas?')
translation.then(result => console.log(result[1]));