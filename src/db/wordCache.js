const db = require('./db_base');

const wordSchema = new mongoose.Schema({
	sourceLanguage: String,
	targetLanguage: String,
	original: String,
	translated: String
})

const WordCache = mongoose.model('WordCache', wordSchema);