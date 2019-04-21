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

	return DocumentTexts.create(payload);
}

module.exports.createDocumentText = createDocumentText;