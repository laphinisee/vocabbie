const _ = require('lodash');

function _cooccurranceMatrix(words) {
	const matrix = {};

	let word, nextWord;
	for (i = 0; i < words.length - 1; i++) {
		word = words[i]
		nextWord = words[i + 1]

		matrix[word] = matrix[word] || {};
		matrix[word][nextWord] = matrix[word][nextWord] || 0;
		matrix[word][nextWord] += 1;

		matrix[nextWord] = matrix[nextWord] || {};
		matrix[nextWord][word] = matrix[nextWord][word] || 0;
		matrix[nextWord][word] += 1;

		matrix[word] = matrix[word] || {};
		matrix[word][word] = matrix[word][word] || 0;
		matrix[word][word] += 1;
	}

	matrix[nextWord] = matrix[nextWord] || {};
	matrix[nextWord][nextWord] = matrix[nextWord][nextWord] || 0;
	matrix[nextWord][nextWord] += 1;

	return matrix
}

function _wordScores(matrix) {
	const scores = {};

	let degree, frequency;
	Object.keys(matrix).forEach(key => {
		frequency = matrix[key][key]
		degree = Object.values(matrix[key]).reduce((a, b) => a + b) - frequency
		scores[key] = degree / frequency
	})

	return scores;
}

function _rankWords(scores) {
	return _.sortBy(Object.keys(scores), [(word) => { return -1 * (scores[word] + (word.length / 100.0)) }])
}

function rake(document) {
	const words = document.split(' ');

	const matrix = _cooccurranceMatrix(words);
	const scores = _wordScores(matrix);
	const topWords = _rankWords(scores);

	return topWords;
}

module.exports = {
	rake
};

// let text = 'Because RAKE splits candidate keywords by stop words, extracted keywords do not contain interior stop words. While RAKE has generated strong interest due to its ability to pick out highly specific terminology, an interest was also expressed in identifying keywords that contain interior stop words such as axis of evil. To find these RAKE looks for pairs of keywords that adjoin one another at least twice in the same document and in the same order. A new candidate keyword is then created as a combination of those keywords and their interior stop words. The score for the new keyword is the sum of its member keyword scores.'
// console.log(rake(text))

