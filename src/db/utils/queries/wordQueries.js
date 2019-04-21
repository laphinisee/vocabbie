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

	Words.findOne(
		{ id: wordId },
		(err, result) => {
			if (!result) { Words.create(wordPayload); }
		}
	)

	
}

function _updateCounts(wordIds) {
	wordIds.forEach(wordId => {
		Words.updateOne(
			{ id: wordId },
			{ $inc: { count: 1 } },
			(err, result) => { if (err) console.log(err + '***') }
		);
	})

	Words.updateMany(
		{ id: { $in: wordIds } },
		{ $inc: { num_documents: 1 } },
		(err, result) => { if (err) console.log(err + '&&&') }
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

module.exports.createWord = createWord;
module.exports.getTranslations = getTranslations;