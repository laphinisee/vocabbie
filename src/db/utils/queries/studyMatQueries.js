const studyMatSchema = require('../schemas/studyMatSchema');
const documentSchema = require('../schemas/documentSchema');

const _ = require('lodash');

const wordQuery = require('../queries/wordQueries');

const StudyMats = studyMatSchema.StudyMats;
const Documents = documentSchema.Documents;

function createStudyMat(studyMatEnum, sourceLanguage, targetLanguage, savedWords) {
	const payload = {
		sourceLanguage: sourceLanguage,
		targetLanguage: targetLanguage,
		savedWords: savedWords
	}

	const newStudyMat = new StudyMats(payload)
	return newStudyMat.save();
}

function getStudyMat(studyMatId) {
	return StudyMats.findById(studyMatId).exec();
}

function addWordsById(studyMatId, words) {
	return StudyMats.findByIdAndUpdate(
		studyMatId,
		{ $addToSet: {
			savedWords: { $each: words }
		}}
	).exec();
}

function removeWordsById(studyMatId, words) {
	return StudyMats.findByIdAndUpdate(
		studyMatId,
		{ $pullAll: {
			savedWords: words
		}}
	).exec();
}

function addWords(studyMat, words) {
	console.log(studyMat)
	studyMat['savedWords'] = _.union(studyMat['savedWords'], words);
	return studyMat.save();
}

function removeWords(studyMat, words) {
	studyMat['savedWords'] = _.pullAll(studyMat['savedWords'], words);
	return studyMat.save();
}

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;
module.exports.addWords = addWords;
module.exports.removeWords = removeWords;
