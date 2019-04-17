const mongoose = require('mongoose');
const dbAuth = require('./dbAuth');

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error);

db.once('open', function() {
	console.log("Connected to DB!");
});

process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('\nDB connection closed by Node process ending');
		process.exit(0);
	});
});

const mongoUrl = 'mongodb+srv://' + dbAuth.username + ':' + dbAuth.password + '@cluster0-cso4e.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoUrl, {useNewUrlParser: true});