const server = require('../server');

const app = server.app,
	query = server.query;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../keys/keys');

const passport = require('passport');
require('../../../passport')(passport)
app.use(passport.initialize());

app.post('/login', function(req, res){
	query.users.getUserByEmail(req.body.email).then(user => {
		if (!user) {
			return res.status(200).json({ error: "Incorrect email and/or password." });
		}

		bcrypt.compare(req.body.password, user.password).then(isMatch => {
			if (isMatch) {
				const payload = {
					id: user.id,
					name: user.name
				};

				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926 // 1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: "Bearer " + token,
							name: user.name,
							email: user.email,
							id: user.id,
						});
					}
				);

			} else {
				return res
					.status(200)
					.json({ error: "Incorrect email and/or password." });
			}
		});
	});
})