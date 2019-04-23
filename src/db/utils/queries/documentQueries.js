const documentSchema = require('../schemas/documentSchema');
const documentTextQueries = require('./documentTextQueries');

const Documents = documentSchema.Documents;

function createDocument(name, ownerId, plaintext, sourceLanguage, targetLanguage, allWords, keyWords) {
	return documentTextQueries.createDocumentText(
		plaintext, 
		sourceLanguage, 
		targetLanguage, 
		allWords, 
		keyWords
	).then(result => {
		const payload = {
			textId: result['_id'],
			name: name,
			owner: ownerId
		}

		const doc = new Documents(payload);
		return doc.save();
	})
}

function getUserDocuments(userId) {
	return Documents.find(
		{ owner: userId },
		'name _id text.plaintext'
	).exec();
}

function getAllUserDocuments(userId) {
	return Documents.find(
		{},
		'name _id text.plaintext'
	).exec();
}

function getDocument(documentId) {
	return Documents.findById(documentId).exec();
}

module.exports.createDocument = createDocument;
module.exports.getUserDocuments = getUserDocuments;
module.exports.getAllUserDocuments = getAllUserDocuments;
module.exports.getDocument = getDocument;
