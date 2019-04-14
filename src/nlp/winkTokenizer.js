const wink_tokenizer = require('wink-tokenizer');

const tokenizer = wink_tokenizer();

module.exports.tokenize = function tokenize(str) {
	const allTokens = tokenizer.tokenize(str)
	const wordTokens = allTokens
		.filter(data => data.tag === 'word')
		.map(token => token.value);

	return {
		'all_tokens': allTokens,
		'word_tokens': wordTokens
	}
}