const documentSchema = require('../schemas/documentSchema');
const documentTextQueries = require('./documentTextQueries');

const Documents = documentSchema.Documents;
const DocumentTexts = documentTextSchema.DocumentTexts;

function createDocument(name, ownerId, plaintext, sourceLanguage, targetLanguage, allWords, keyWords) {
	return documentTextQueries.createDocumentText(
		plaintext, 
		sourceLanguage, 
		targetLanguage, 
		allWords, 
		keyWords
	).then(text => {
		const payload = {
			text: text,
			name: name,
			owner: ownerId
		}

		return Documents.create(payload);
	})
}

function getUserDocuments(userId) {
	return Documents.find(
		{ owner: userId },
		'name _id text.plaintext'
	).exec();
}

function getDocument(documentId) {
	return Documents.findById(documentId).exec();
}

module.exports.createDocument = createDocument;
module.exports.getUserDocuments = getUserDocuments;
module.exports.getDocument = getDocument;
