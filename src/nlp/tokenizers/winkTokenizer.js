const wink_tokenizer = require( 'wink-tokenizer' );

const tokenizer = wink_tokenizer();

function tokenize(str):
	return tokenizer.tokenizer(str)
		.filter(data => data.tag === 'word')
		.map(token => token.value);