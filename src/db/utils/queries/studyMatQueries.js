const studyMatSchema = require('../schemas/studyMatSchema');

const StudyMats = studyMatSchema.StudyMats;

function createStudyMat(userId, studyMatEnum, allWords, keyWords, savedWords) {
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

	return StudyMats.create(payload);
}

function getStudyMat(studyMatId) {
	return StudyMats.findById(studyMatId).exec();
}

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;

