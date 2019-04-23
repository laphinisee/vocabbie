const mongoose = require('mongoose');
const wordSchema = require('../schemas/wordSchema');

const Words = wordSchema.Words;

function _wordId(word, sourceLanguage, targetLanguage) {
	return [sourceLanguage, targetLanguage, word].join('_');
}

const extraKeys = ['pronunciation'];
function createWord(token, sourceLanguage, targetLanguage) {
	const word = token['text']['content'];
	const wordId = _wordId(word, sourceLanguage, targetLanguage);

	const wordPayload = {
		id: wordId,
		sourceLanguage: sourceLanguage,
		targetLanguage: targetLanguage,
		originalText: word,
		translatedText: token['translation'],
		partOfSpeech: token['partOfSpeech']['tag'],
		lemma: token['lemma'],
		isStopword: token['isStopword'],
		json: token
	};

	extraKeys.forEach(key => {
		if (token[key]) {
			wordPayload[key] = token[key];
		}
	});

	const query = Words.findOne({ id: wordId });

	return query.then(result => {
		if (result) {
			return result;
		} else {
			const mongoWord = new Words(wordPayload);
			return mongoWord.save();
		}
	});
}

function _updateCounts(wordIds) {
	wordIds.forEach(wordId => {
		Words.updateOne(
			{ id: wordId },
			{ $inc: { count: 1 } },
			(err, result) => { if (err) console.log(err) }
		);
	})

	Words.updateMany(
		{ id: { $in: wordIds } },
		{ $inc: { num_documents: 1 } },
		(err, result) => { if (err) console.log(err) }
	);
}

function getTranslations(tokens, sourceLanguage, targetLanguage) {
	const wordIds = tokens.map(token => _wordId(token['text']['content'], sourceLanguage, targetLanguage));

	_updateCounts(wordIds);

	return Words.find({ id: {$in: wordIds} }, 'id translatedText')
		.exec()
		.then(result => {
			const translations = {};
			result.forEach(translation => {
				translations[translation['id']] = translation['translatedText'];
			})

			return wordIds.map(wordId => translations[wordId]);
		});
}

function getWords(words, sourceLanguage, targetLanguage) {
	let wordIds;

	if (typeof words[0] === 'string') {
		wordIds = words.map(word => _wordId(word, sourceLanguage, targetLanguage));
	} else {
		wordIds = words.map(word => _wordId(word['text']['content'], word['sourceLanguage'], word['targetLanguage']));
	}

	return Words.find({ id: {$in: wordIds} }).exec();
}

module.exports.createWord = createWord;
module.exports.getTranslations = getTranslations;