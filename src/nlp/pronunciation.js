const pinyin = require('pinyin');
const _ = require('lodash');

const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

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

module.exports.supportedLanguages = ['zh', 'ja'];
module.exports.getPronunciation = getPronunciation;