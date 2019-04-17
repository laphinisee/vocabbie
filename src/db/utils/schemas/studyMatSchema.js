const mongoose = require('mongoose');
const words = require('./wordSchema');

const studyMatEnums = ['flashcard', 'vocabSheet']
const studyMatSchema = new mongoose.Schema({
	type: { type: String, enum: studyMatEnums, required: true },
	savedWords: [words.schema]
})

module.exports.studyMatEnums = studyMatEnums;
module.exports.schema = studyMatSchema;
module.exports.StudyMats = mongoose.model('StudyMats', studyMatSchema);