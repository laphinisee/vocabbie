const pinyin = require('pinyin');
const _ = require('lodash');

const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

/**
 * TODO: add error message when language is not supported.
 * 		 currently fails and hangs. 
 */

const supportedLanguages = ['zh', 'ja', 'es', 'fr', 'de'];
function languageSupported(language) {
	return supportedLanguages.includes(language);
}

function _getPronunciationChinese(word) {
	const pronunciation = _.flattenDeep(pinyin(word));
	return Promise.resolve(pronunciation.join(' '));
}

const kuroshiro = new Kuroshiro();
const kuroshiroAnalyzer = kuroshiro.init(new KuromojiAnalyzer());
function _getPronunciationJapanese(word) {
	return kuroshiroAnalyzer.then(result => {
		return kuroshiro.convert(word, {
			to: 'romaji',
			romajiSystem: 'hepburn'
		});
	})
}

function getPronunciation(word, sourceLanguage) {
	if (sourceLanguage === 'zh') {
		return _getPronunciationChinese(word);
	} else if (sourceLanguage === 'ja') {
		return _getPronunciationJapanese(word);
	}

	return Promise.resolve(null);
}

module.exports.languageSupported = languageSupported;
module.exports.getPronunciation = getPronunciation;