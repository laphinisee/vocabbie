const users = require('../schemas/userSchema');

function createUser(userInfo) {
	// See user schema for proper userInfo format
	users.create(userInfo);
}

function getUserStudyMats(userId) {
	return users.findById(userId, 'studyMats').exec();
}

module.exports.createUser = createUser;
module.exports.getUserStudyMats = getUserStudyMats;