const mongoose = require('mongoose');

const words = require('./wordSchema');
const users = require('./userSchema');
const studyMat = require('./studyMatSchema');
const documentText = required('./documentTextSchema');

const documentSchema = new mongoose.Schema({
	text: documentText.schema,
	name: { type: String, required: true },
	owner: { type: users.schema, required: true },
	sharedUsers: [users.schema],
	creationTime: { type: Date, default: Date.now },
	studyMats: { type: Map, of: studyMat.schema }
})

module.exports.schema = documentSchema;
module.exports.Documents = mongoose.model('Documents', documentSchema);