const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true }, 
	sourceLanguage: { type: String, required: true },
	targetLanguage: { type: String, required: true },
	originalText: { type: String, required: true },
	translatedText: { type: String, required: true },
	partOfSpeech: { type: String, required: true },
	lemma: String,
	isStopword: { type: Boolean, default: false },
	pronunciation: String,
	other: String,
	json: { type: Object, required: true }
})

module.exports.schema = wordSchema;
module.exports.Words = mongoose.model('Words', wordSchema);
module.exports.Words.findAndModify = function (query, sort, doc, options, callback) {
	return this.collection.findAndModify(query, sort, doc, options, callback);
};