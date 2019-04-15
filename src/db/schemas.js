const db = require('./db_base');
const mongoose = require('mongoose');
const crypto = require('crypto');

const wordSchema = new mongoose.Schema({
	sourceLanguage: { type: String, required: true },
	targetLanguage: { type: String, required: true },
	originalText: {
		type: String,
		required: true
	},
	translatedText: { type: String, required: true },
	partOfSpeech: String,
	stem: String,
	isStopword: { type: Boolean, default: false },
	count: { type: Number, required: true },
	json: { type: String, required: true },
	other: String
})

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	salt: { type: String, default: crypto.randomBytes(16) },
	password: { type: String, required: true },
	email: { type: String, required: true },
	firstname: { type: String, required: true },
	lastname: String
})

module.exports.WordCache = mongoose.model('WordCache', wordSchema);