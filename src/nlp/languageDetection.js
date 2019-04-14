const {Translate} = require('@google-cloud/translate');
const apiKey = require('./googleTranslateAPIKey');

const translate = new Translate({
	projectId: apiKey.projectId
});

function detectLanguage(text) {
	return translate.detect(text);
}

module.exports.detectLanguage = detectLanguage;

// console.log('hello');
// const detection = detectLanguage('hello how are you hola como estas');
// detection.then(data => console.log(data[0]));