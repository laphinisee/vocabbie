const userSchema = require('../schemas/userSchema');

const bcrypt = require('bcryptjs');

const Users = userSchema.Users;

function createUser(name, email, password, callback) {
	const newUser = new Users({
		name: name,
		email: email,
		password: password
	});
	
	bcrypt.genSalt(10, (err, salt) => {
		return bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) { throw err }
			newUser.password = hash;
			return newUser.save().then(user => callback(user));
		})
	})
}

function deleteUser(userId) {
	return Users.findByIdAndDelete(userId).exec();
}

function getUserByEmail(email) {
	return Users.findOne({ email: email }).exec();	
}

function updateUser(userId, payload, onSuccess, onFailure) {

	// const keys = Object.keys(payload).filter(key => (payload[key]))
	// const cleanPayload = keys.map(key => payload[key])
	if (payload['password']) {
		return bcrypt.genSalt(10, (err, salt) => {
			return bcrypt.hash(payload['password'], salt, (err, hash) => {
				if (err) { throw err }
				payload['password'] = hash;
				Users.findByIdAndUpdate(userId, payload).exec();
				onSuccess()
			})
		}); 
	} else {
		Users.findByIdAndUpdate(userId, payload).exec();
		onFailure()
	}
}

module.exports = {
	createUser,
	deleteUser,
	getUserByEmail,
	updateUser
};
