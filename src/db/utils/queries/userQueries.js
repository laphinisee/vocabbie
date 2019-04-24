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

function getUserByEmail(email) {
	return Users.findOne({ email: email }).exec();	
}

module.exports = {
	createUser,
	deleteUser,
	getUserByEmail
};
