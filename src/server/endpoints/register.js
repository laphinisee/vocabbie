const server = require('../server');

const app = server.app,
	query = server.query;

app.post('/register', function(req, res) {
	query.user.getUserByEmail(req.body.email).then(user => {
		if (user) {
			return res.status(200).json({ error: "Email already exists" });
		}

		query.user.createUser(req.body.name, req.body.email, req.body.password);
	});
});