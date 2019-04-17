const mongoose = require('mongoose');
const studyMats = require('./studyMatSchema');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	salt: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	birthday: Date,
	joinDate: { type: Date, default: Date.now },
	studyMats: [studyMats.schema]
})

module.exports.schema = userSchema;
module.exports.Users = mongoose.model('Users', userSchema);