const userSchema = require('../schemas/userSchema');

const Users = userSchema.Users;

function createUser(userInfo) {
	// See user schema for proper userInfo format
	Users.create(userInfo);
}

function getUserStudyMats(userId) {
	return Users.findById(userId, 'studyMats').exec();
}

module.exports.createUser = createUser;
module.exports.getUserStudyMats = getUserStudyMats;