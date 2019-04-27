const db = require('./db');

const wordQueries = require('./utils/queries/wordQueries');
const studyMatQueries = require('./utils/queries/studyMatQueries');
const userQueries = require('./utils/queries/userQueries');
const documentQueries = require('./utils/queries/documentQueries');
const documentTextQueries = require('./utils/queries/documentTextQueries');

var Promise = require('bluebird');

module.exports.db = db;
module.exports.word = wordQueries;
module.exports.studyMat = studyMatQueries;
module.exports.user = userQueries;
module.exports.document = documentQueries;
module.exports.documentText = documentTextQueries;