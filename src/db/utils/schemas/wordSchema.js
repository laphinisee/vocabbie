const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
	sourceLanguage: { type: String, required: true },
	targetLanguage: { type: String, required: true },
	originalText: {
		type: String,
		required: true
	},
	translatedText: { type: String, required: true },
	partOfSpeech: String,
	lemma: String,
	isStopword: { type: Boolean, default: false },
	count: { type: Number, required: true, default: 1 },
	num_documents: { type: Number, required: true, default: 1 },
	pronunciation: String,
	other: String,
	json: { type: Object, required: true }
})

module.exports.schema = wordSchema;
module.exports.Words = mongoose.model('Words', wordSchema);