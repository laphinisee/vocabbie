const userSchema = require('../schemas/userSchema');

const Users = userSchema.Users;

function createUser(userInfo) {
	return Users.create(userInfo);
}

module.exports.createUser = createUser;