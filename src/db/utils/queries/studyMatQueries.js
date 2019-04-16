const studyMatSchema = require('../schemas/studyMatSchema');

const StudyMats = StudyMats;

function createStudyMat(userId, studyMatEnum, words) {
	if (!studyMats.studyMatEnums.includes(studyMatEnum)) {
		throw 'Invalid Study Mat type: must be one of: ' + studyMats.studyMatEnums.join(', ');
	}

	StudyMats.create({
		ownerId: userId,
		type: studyMatEnum,
		words: words
	});
}

function getStudyMat(studyMatId) {
	return StudyMats.findById(studyMatId, 'words').exec();
}

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;