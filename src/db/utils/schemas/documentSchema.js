const mongoose = require('mongoose');

const words = require('./wordSchema');
const users = require('./userSchema');
const studyMat = require('./studyMatSchema');
const documentText = require('./documentTextSchema');

const documentSchema = new mongoose.Schema({
	textId: { type: mongoose.Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
	owner: { type: mongoose.Schema.Types.ObjectId, required: true },
	sharedUsers: [mongoose.Schema.Types.ObjectId],
	creationTime: { type: Date, default: Date.now },
	studyMats: { type: Map, of: studyMat.schema, default: {} },
	isPublic: { type: Boolean, default: false }
})

module.exports.schema = documentSchema;
module.exports.Documents = mongoose.model('Documents', documentSchema);