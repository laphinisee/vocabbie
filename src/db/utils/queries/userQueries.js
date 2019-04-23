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

function deleteUser(userId) {
	return Users.findByIdAndDelete(userId).exec();
}

module.exports.createUser = createUser;