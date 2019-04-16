const studyMats = require('../schemas/studyMatSchema');

function createStudyMat(userId, studyMatEnum, words) {
	if (!studyMats.studyMatEnums.includes(studyMatEnum)) {
		throw 'Invalid Study Mat type: must be one of: ' + studyMats.studyMatEnums.join(', ');
	}

	studyMats.create({
		ownerId: userId,
		type: studyMatEnum,
		words: words
	});
}

function getStudyMat(studyMatId) {
	return studyMats.findById(studyMatId, 'words').exec();
}

module.exports.createStudyMat = createStudyMat;
module.exports.getStudyMat = getStudyMat;