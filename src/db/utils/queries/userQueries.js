const userSchema = require('../schemas/userSchema');

const bcrypt = require('bcryptjs');

const Users = userSchema.Users;

function createUser(name, email, password) {
	const newUser = new User({
		name: name,
		email: email,
		password: password
	});
	
	return bcrypt.genSalt(10, (err, salt) => {
		return bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) { throw err }
			newUser.password = hash;
			return newUser.save();
		})
	});	   
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
