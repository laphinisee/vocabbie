const mongoose = require('mongoose');

const words = require('./wordSchema');

const documentTextSchema = new mongoose.Schema({
	plaintext: { type: String, required: true, index: 'text', unique: true },
	sourceLanguage: { type: String, required: true },
	allWords: [String],
	keyWords: [String]
});

module.exports.schema = documentTextSchema;
module.exports.DocumentTexts = mongoose.model('DocumentTexts', documentTextSchema);