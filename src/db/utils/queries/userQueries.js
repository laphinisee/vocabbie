const userSchema = require('../schemas/userSchema');

const Users = userSchema.Users;

function createUser(name, email, password) {
	return Users.create(userInfo);
}

module.exports.createUser = createUser;