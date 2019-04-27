const documentSchema = require('../schemas/documentSchema');
const documentTextQueries = require('./documentTextQueries');

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

function getAllUserDocuments(userId) {
	return Documents.find(
		{},
		'name _id textId'
	).exec();
}

function getDocument(documentId) {
	return Documents.findById(documentId).exec();
}

function deleteDocument(documentId) {
	return Documents.findByIdAndDelete(documentId).exec();
}

module.exports.createDocument = createDocument;
module.exports.getUserDocuments = getUserDocuments;
module.exports.getAllUserDocuments = getAllUserDocuments;
module.exports.getDocument = getDocument;
