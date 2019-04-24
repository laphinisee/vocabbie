const studyMatSchema = require('../schemas/studyMatSchema');
const documentSchema = require('../schemas/documentSchema');

const wordQuery = require('../queries/wordQueries');

const StudyMats = studyMatSchema.StudyMats;
const Documents = documentSchema.Documents;

function createStudyMat(studyMatEnum, sourceLanguage, targetLanguage, savedWords) {
	if (!studyMats.studyMatEnums.includes(studyMatEnum)) {
		throw 'Invalid Study Mat type: must be one of: ' + studyMats.studyMatEnums.join(', ');
	}

	const payload = {
		type: studyMatEnum,
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

function addWords(studyMatId, words) {
	return StudyMats.findByIdAndUpdate(
		studyMatId,
		{ $addToSet: {
			savedWords: { $each: words }
		}}
	).exec();
}

function removeWords(studyMatId, words) {
	return StudyMats.findByIdAndUpdate(
		studyMatId,
		{ $pullAll: {
			savedWords: words
		}}
	).exec();
}

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;

