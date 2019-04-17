const mongoose = require('mongoose');
const words = require('./wordSchema');

const studyMatEnums = ['flashcard', 'vocabSheet']
const studyMatSchema = new mongoose.Schema({
	ownerId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
	type: { type: String, enum: studyMatEnums, required: true },
	allWords: [words.schema],
	keyWords: [words.schema],
	savedWords: [words.schema],
})

module.exports.studyMatEnums = studyMatEnums;
module.exports.schema = studyMatSchema;
module.exports.StudyMats = mongoose.model('StudyMats', studyMatSchema);