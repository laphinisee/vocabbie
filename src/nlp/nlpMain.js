const translate = require('./utils/translation');
const tokenize = require('./utils/tokenizer');
const pronunciation = require('./utils/pronunciation');
const stopwords = require('./utils/stopwords');

const query = require('../db/query');

function processText(text, targetLanguage='en') {
	return tokenize.tokenizeText(text).then(result => {
		return result[0];
	}).then(result => {
		const sourceLanguage = result['language'],
			tokens = result['tokens'],
			cachedTranslations = query.word.getTranslations(tokens, sourceLanguage, targetLanguage);

		return Promise.all([sourceLanguage, tokens, cachedTranslations]);
	}).then(result => {
		[ sourceLanguage, tokens, cachedTranslations ] = result;

		const untranslatedWordList = [];
		let token, translation;
		for (i = 0; i < tokens.length; i++) {
			token = tokens[i]
			translation = cachedTranslations[i];

			if (translation) {
				token['translation'] = translation;
			} else {
				untranslatedWordList.push(token['text']['content']);
			}
		}

		const translations = translate.translateText(untranslatedWordList, sourceLanguage);

		return Promise.all([sourceLanguage, tokens, translations]);
	}).then(result => {
		[ sourceLanguage, tokens, translationResult ] = result;

		const translations = translationResult[0];
		const pronunciations = [];

		let token, word, isPunctuation;
		let translationIndex = 0;
		for (i = 0; i < tokens.length; i++) {
			token = tokens[i];
			word = token['text']['content'];

			if (!token['translation']) {
				token['translation'] = translations[translationIndex++];
			}

			if (stopwords.languageSupported(sourceLanguage)) {
				token['isStopword'] = stopwords.isStopword(token, sourceLanguage);
			}

			if (pronunciation.languageSupported(sourceLanguage)) {
				pronunciations.push(pronunciation.getPronunciation(word, sourceLanguage));
			}
		}

		return Promise.all([sourceLanguage, tokens, Promise.all(pronunciations)]);
	}).then(result => {
		[ sourceLanguage, tokens, pronunciations ] = result;

		if (pronunciation.languageSupported(sourceLanguage)) {
			for (i = 0; i < tokens.length; i++) {
				tokens[i]['pronunciation'] = pronunciations[i];
			}
		}

		// const mongoWords = [];
		// tokens.forEach(token => {
		// 	mongoWords.push(query.word.createWord(token, sourceLanguage, targetLanguage));
		// });

		const mongoWords = tokens.map(token => query.word.createWord(token, sourceLanguage, targetLanguage));

		return Promise.all([sourceLanguage, tokens, Promise.all(mongoWords)]);
	})
	// .then(result => {
	// 	const sourceLanguage = result[0],
	// 		tokens = result[1];

	// 	const mongoWords = query.word.getWords(tokens);

	// 	return Promise.all([sourceLanguage, tokens, mongoWords]);
	// }).then(result => {
	// 	[ sourceLanguage, tokens, mongoWords ] = result;


	// });
}

module.exports.processText = processText;

let text
text = '大象是一個漂亮的大象'
text = 'Hola cómo estás'

let translation 
translation = processText(text) //我是一個漂亮的蝴蝶。
translation.then(result => {
	console.log('===== SOURCE LANGUAGE =====')
	console.log(result[0])
	console.log('===== TOKENS =====')
	console.log(result[1])
	console.log('===== MONGO WORDS =====')
	console.log(result[2])
});

// translation = processText('かわいい犬が好き。')
// translation.then(result => console.log(result[1]));


// translation = processText('ブライアンくんは日本に行く。')
// translation.then(result => console.log(result[1]));
