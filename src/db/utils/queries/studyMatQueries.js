const studyMatSchema = require('../schemas/studyMatSchema');
const documentSchema = require('../schemas/documentSchema');

const StudyMats = studyMatSchema.StudyMats;
const Documents = documentSchema.Documents;

function createStudyMat(documentId, userId, studyMatEnum, allWords, keyWords, savedWords) {
	if (!studyMats.studyMatEnums.includes(studyMatEnum)) {
		throw 'Invalid Study Mat type: must be one of: ' + studyMats.studyMatEnums.join(', ');
	}

	const payload = {
		ownerId: userId,
		type: studyMatEnum,
		allWords: allWords,
		keyWords: keyWords,
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

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;

