const userSchema = require('../schemas/userSchema');

const Users = userSchema.Users;

function createUser(name, email, password) {
	const newUser = new User({
		name: name,
		email: email,
		password: password
	});

	return newUser.save();
}

module.exports.createUser = createUser;