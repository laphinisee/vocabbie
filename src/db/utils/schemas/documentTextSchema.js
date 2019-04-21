const mongoose = require('mongoose');

const words = require('./wordSchema');

const documentTextSchema = new mongoose.Schema({
	plaintext: { type: String, required: true, unique: true },
	sourceLanguage: { type: String, required: true },
	targetLanguage: { type: String, required: true },
	allWords: [words.schema],
	keyWords: [words.schema]
})

module.exports.schema = documentTextSchema;
module.exports.DocumentTexts = mongoose.model('DocumentTexts', documentTextSchema);