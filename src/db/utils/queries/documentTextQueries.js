const documentTextSchema = require('../schemas/documentTextSchema');

const DocumentTexts = documentTextSchema.DocumentTexts;

function createDocumentText(plaintext, sourceLanguage, targetLanguage, allWords, keyWords) {
	const payload = {
		plaintext: plaintext,
		sourceLanguage: sourceLanguage,
		targetLanguage: targetLanguage,
		allWords: allWords,
		keyWords: keyWords
	}

	const query = DocumentTexts.findOne({ plaintext: plaintext });

	return query.then(result => {
		if (result) {
			return result;
		} else {
			const mongoDocumentText = new DocumentTexts(payload);
			return mongoDocumentText.save();
		}
	});
}

function getDocumentText(documentTextId) {
		return DocumentTexts.findById(documentTextId).exec();
	}

module.exports.createDocumentText = createDocumentText;
module.exports.getDocumentText = getDocumentText;