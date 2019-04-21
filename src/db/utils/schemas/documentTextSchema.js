const mongoose = require('mongoose');

const words = require('./wordSchema');

const documentTextSchema = new mongoose.Schema({
	hash: { type: String, required: true, unique: true },
	plaintext: String,
	sourceLanguage: { type: String, required: true },
	targetLanguage: { type: String, required: true },
	allWords: [[words.schema]],
	keyWords: [words.schema]
})

module.exports.schema = documentTextSchema;
module.exports.DocumentTexts = mongoose.model('DocumentTexts', documentTextSchema);