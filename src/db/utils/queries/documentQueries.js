const documentSchema = require('../schemas/documentSchema');

const Documents = documentSchema.Documents;

function createDocument(userId, studyMatEnum, allWords, keyWords, savedWords) {
	const studyMatPayload = {
		ownerId: userId,
		type: studyMatEnum,
		allWords: allWords,
		keyWords: keyWords,
		savedWords: savedWords
	}

	StudyMats.create(studyMatPayload);
}