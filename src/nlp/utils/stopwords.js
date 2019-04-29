const sw = require('stopword');
const cjkConv = require('cjk-conv');
const _ = require('lodash');

const punctuationTag = 'PUNCT';

function languageSupported(language) {
	return language in sw;
}

function _getStopwordsChinese() {
	const traditionalStopwords = _.flatMap(sw['zh'], word => [word, cjkConv.cn2tw(word)]);
	return traditionalStopwords;
}

sw['zh'] = _getStopwordsChinese();
function getStopwords(language) {
	return sw[language];
}

function isStopword(token, sourceLanguage, punctuationIsStopword=true) {
	const stopwords = sw[sourceLanguage],
		word = token['text']['content'],
		lemma = token['lemma'],
		isPunctuation = token['partOfSpeech']['tag'];

	if (!stopwords) {
		return null;
	}

	const wordIsStopword = stopwords.includes(word) || stopwords.includes(lemma) || stopwords.includes(word.toLowerCase()) || stopwords.includes(lemma.toLowerCase());
	const wordIsPunctuation = (isPunctuation === 'PUNCT');

	return punctuationIsStopword ? 
		wordIsStopword || wordIsPunctuation :
		wordIsStopword;
}

module.exports.languageSupported = languageSupported;
module.exports.getStopwords = getStopwords;
module.exports.isStopword = isStopword;