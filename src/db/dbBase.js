const mongoose = require('mongoose');

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

const mongoUrl = '' // TODO