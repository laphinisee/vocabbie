const {Translate} = require('@google-cloud/translate');

const translate = new Translate();

function detectLanguage(text) {
	return translate.detect(text);
}

module.exports.detectLanguage = detectLanguage;