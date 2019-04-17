const wordSchema = require('../schemas/wordSchema');

const Words = wordSchema.Words;

function _wordId(token, sourceLanguage, targetLanguage) {
	const word = token['text']['content'];
	return [sourceLanguage, targetLanguage, word].join('_');
}

const extraKeys = ['pronunciation'];
function createWord(token, sourceLanguage, targetLanguage) {
	const wordId = _wordId(token, sourceLanguage, targetLanguage);

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
		if (token['pronunciation']) {
			wordPayload['pronunciation'] = token['pronunciation'];
		}
	});

	Words.create(wordPayload);
}

function _updateCounts(wordIds) {
	wordIds.forEach(wordId => {
		Words.updateOne(
			{ id: wordId },
			{ $inc: { count: 1 } }
		);
	})

	Words.updateMany(
		{ id: { $in: wordIds } },
		{ $inc: { num_documents: 1 } }
	);
}

function getTranslations(tokens, sourceLanguage, targetLanguage) {
	const wordIds = tokens.map(token => _wordId(token, sourceLanguage, targetLanguage));

	_updateCounts(wordIds);

	return Words.find()
		.where('id')
			.in(wordIds)
		.select('id translatedText')
		.exec(function(err, result) {
			if (err) return console.error(err);

			const translations = {};
			result.forEach(translation => {
				translations[translation['id']] = translation['translatedText'];
			})

			return wordIds.map(wordId => translations[wordId]);
		});
}

