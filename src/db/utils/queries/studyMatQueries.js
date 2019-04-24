const studyMatSchema = require('../schemas/studyMatSchema');
const documentSchema = require('../schemas/documentSchema');

const wordQuery = require('../queries/wordQueries');

const StudyMats = studyMatSchema.StudyMats;
const Documents = documentSchema.Documents;

function createStudyMat(documentId, studyMatEnum, savedWords) {
	if (!studyMats.studyMatEnums.includes(studyMatEnum)) {
		throw 'Invalid Study Mat type: must be one of: ' + studyMats.studyMatEnums.join(', ');
	}

	const payload = {
		type: studyMatEnum,
		savedWords: savedWords
	}

	return Documents.findById(documentId).exec().then(document => {
		StudyMats.create(payload).then(sm => {
			document.studyMats.push(sm);
			document.save();
			return sm;
		})
	})
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

