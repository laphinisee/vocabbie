const mongoose = require('mongoose');
const wordSchema = require('../schemas/wordSchema');

const _ = require('lodash');

const Words = wordSchema.Words;

function _wordId(word, sourceLanguage, targetLanguage) {
	return [sourceLanguage, targetLanguage, word].join('_');
}

const extraKeys = ['pronunciation'];
function createWord(token, sourceLanguage, targetLanguage) {
	const word = token['text']['content'];
	const wordId = _wordId(word, sourceLanguage, targetLanguage);

	const wordPayload = {
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

	console.log("createWord")
	console.log(Words.findAndModify)

	return Words.findAndModify(
		{ id: wordId },
		[['id','asc']],
		{ "$setOnInsert": { ...wordPayload } },
		{new: true, upsert: true}
	  ).then(result => { 
		  console.log(result)
		  return result 
	   })
	  .catch(err => { console.log(err)})

	// return Words.findOneOrCreate(wordPayload, (err, result) => {
	// 	console.log("res:", result)
	// 	console.log("err:", err)
	// 	return result
	// });
}

function getTranslations(tokens, sourceLanguage, targetLanguage) {
	const wordIds = tokens.map(token => _wordId(token['text']['content'], sourceLanguage, targetLanguage));

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

	console.log(wordIds);

	return Words.find({ id: {$in: wordIds} })
		.exec()
		.then(result => {
			return result.sort((a, b) => { 
				return wordIds.indexOf(a['id']) - wordIds.indexOf(b['id']) 
			});
		});
}

module.exports.createWord = createWord;
module.exports.getTranslations = getTranslations;
module.exports.getWords = getWords;

