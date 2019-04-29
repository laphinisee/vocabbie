const server = require('../server');

const app = server.app,
	query = server.query;

app.get('/', function(request, response) {
	response.status(200).type('html');
	console.log('- request received:', request.method, request.url);
});