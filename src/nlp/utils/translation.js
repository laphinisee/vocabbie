const {Translate} = require('@google-cloud/translate');

const translate = new Translate();

function translateText(tokenizedText, sourceLanguage, targetLanguage='en') {
	const options = {
		from: sourceLanguage,
		to: targetLanguage
	};
	
	return translate.translate(tokenizedText, options);
}

module.exports.translateText = translateText;