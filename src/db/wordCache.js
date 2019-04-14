const db = require('./db_base');
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
	sourceLanguage: {
		type: String,
		required: true
	},
	targetLanguage: {
		type: String,
		required: true
	},
	originalText: {
		type: String,
		required: true
	},
	translatedText: {
		type: String,
		required: true
	},
	partOfSpeech: String,
	stem: String,
	count: {
		type: Number,
		required: true
	},
	json: {
		type: String,
		required: true
	},
	other: String
})

const WordCache = mongoose.model('WordCache', wordSchema);