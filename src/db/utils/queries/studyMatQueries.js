const studyMatSchema = require('../schemas/studyMatSchema');
const documentSchema = require('../schemas/documentSchema');

const _ = require('lodash');

const wordQuery = require('../queries/wordQueries');

const StudyMats = studyMatSchema.StudyMats;
const Documents = documentSchema.Documents;

function createStudyMat(sourceLanguage, targetLanguage, savedWords) {
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
		}}, {new: true}
	).exec();
}

function addWords(studyMat, words) {
	return addWordsById(studyMat._id, words)
}

function removeWords(studyMat, words) {
	return removeWordsById(studyMat._id, words)
}

function addWordsById(studyMatId, userWords) {
	return StudyMats.findByIdAndUpdate(
		studyMatId,
		{ $addToSet: {
			userAddedWords: { $each: userWords }
		}}
	).exec();
}

function removeWordsById(studyMatId, userWords) {
	return StudyMats.findByIdAndUpdate(
		studyMatId,
		{ $pullAll: {
			userAddedWords: userWords
		}}, {new: true}
	).exec();
}

function addWords(studyMat, userWords) {
	return addWordsById(studyMat._id, userWords)
}

function removeWords(studyMat, userWords) {
	return removeWordsById(studyMat._id, userWords)
}

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;
module.exports.addWords = addWords;
module.exports.removeWords = removeWords;
