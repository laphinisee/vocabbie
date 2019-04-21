const db = require('./db');

const wordQueries = require('./utils/queries/wordQueries');
const studyMatQueries = require('./utils/queries/studyMatQueries');
const userQueries = require('./utils/queries/userQueries');

module.exports.db = db;
module.exports.word = wordQueries;
module.exports.studyMat = studyMatQueries;
module.exports.user = userQueries;