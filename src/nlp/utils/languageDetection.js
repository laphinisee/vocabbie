const {Translate} = require('@google-cloud/translate');

const translate = new Translate();

function detectLanguage(text) {
	return translate.detect(text);
}

function validateText(text) {
	return detectLanguage(text).then(result => {
		return result[1]['data']['detections'][0][0]['isReliable']
	})
}

module.exports.detectLanguage = detectLanguage;