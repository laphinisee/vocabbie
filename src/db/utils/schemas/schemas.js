//// DEPRECATED DO NOT USE ////

// const mongoose = require('mongoose');

// const wordSchema = new mongoose.Schema({
// 	sourceLanguage: { type: String, required: true },
// 	targetLanguage: { type: String, required: true },
// 	originalText: {
// 		type: String,
// 		required: true
// 	},
// 	translatedText: { type: String, required: true },
// 	partOfSpeech: String,
// 	lemma: String,
// 	isStopword: { type: Boolean, default: false },
// 	count: { type: Number, required: true, default: 1 },
// 	num_documents: { type: Number, required: true, default: 1 },
// 	pronunciation: String,
// 	other: String,
// 	json: { type: Object, required: true }
// })

// const studyMatEnums = ['flashcard', 'vocabSheet']
// const studyMatSchema = new mongoose.Schema({
// 	ownerId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
// 	type: { type: String, enum: studyMatEnums, required: true },
// 	words: [wordSchema]
// })

// const userSchema = new mongoose.Schema({
// 	username: { type: String, required: true },
// 	salt: { type: String, required: true },
// 	password: { type: String, required: true },
// 	email: { type: String, required: true },
// 	firstName: { type: String, required: true },
// 	lastName: { type: String, required: true },
// 	birthday: Date,
// 	joinDate: { type: Date, default: Date.now },
// 	studyMats: [studyMatSchema]
// })