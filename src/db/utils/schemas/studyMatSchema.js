const mongoose = require('mongoose');
const words = require('./wordSchema');

const studyMatSchema = new mongoose.Schema({
	sourceLanguage: { type: String, required: true },
	targetLanguage: { type: String, required: true },
	savedWords: [String]
})

module.exports.studyMatEnums = studyMatEnums;
module.exports.schema = studyMatSchema;
module.exports.StudyMats = mongoose.model('StudyMats', studyMatSchema);