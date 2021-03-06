const documentSchema = require('../schemas/documentSchema');
const documentTextQueries = require('./documentTextQueries');
const studyMatQueries = require('./studyMatQueries');

const Documents = documentSchema.Documents;

function createDocument(documentTitle, owner, text, sourceLanguage, targetLanguage, allWords, keyWords) {
	return documentTextQueries.createDocumentText(text, sourceLanguage, targetLanguage, allWords, keyWords).then(result => {
			const payload = {
				textId: result['_id'],
				name: documentTitle,
				owner: owner
			}
		const newDocument = new Documents(payload);
		return newDocument.save();
	})
}

function getUserDocuments(userId) {
	return Documents.find(
		{ owner: userId },
		'name _id textId'
	).exec();
}

function getDocument(documentId) {
	return Documents.findById(documentId).exec();
}

function deleteDocument(documentId) {
	return Documents.findByIdAndDelete(documentId).exec();
}

function shareDocument(documentId, userIds) {
	return Documents.findByIdAndUpdate(documentId, { $addToSet: { sharedUsers: { $each: userIds} }}).exec();
}

function hasPermission(documentId, userId) {
	return getDocument(documentId).then(result => {
		return result['isPublic'] || (result['owner'].equals(userId) || result['sharedUsers'].includes(userId));
	})
}

function addStudyMat(documentId, studyMat) {
	return getDocument(documentId).then(doc => {
		doc['studyMat'] = studyMat;
		doc.save();
	})
}

function getStudyMat(document) {
	return studyMatQueries.getStudyMat(document.studyMat);
}

module.exports.createDocument = createDocument;
module.exports.getUserDocuments = getUserDocuments;
module.exports.getDocument = getDocument;
module.exports.deleteDocument = deleteDocument;
module.exports.hasPermission = hasPermission;
module.exports.addStudyMat = addStudyMat;
module.exports.getStudyMat = getStudyMat;