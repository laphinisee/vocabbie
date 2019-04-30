const translate = require('./utils/translation');
const tokenize = require('./utils/tokenizer');
const pronunciation = require('./utils/pronunciation');
const stopwords = require('./utils/stopwords');
const keywords = require('./utils/keywords');

const query = require('../db/query');

const _ = require('lodash');

var Promise = require('bluebird');

const maxWords = 128;
function processText(text, targetLanguage='en') {
	return tokenize.tokenizeText(text).then(result => {
		return result[0];
	}).then(result => {
		const sourceLanguage = result['language'],
			tokens = result['tokens'],
			cachedTranslations = query.word.getTranslations(tokens, sourceLanguage, targetLanguage);

		return Promise.all([sourceLanguage, tokens, cachedTranslations]);
	}).then(result => {
		const [ sourceLanguage, tokens, cachedTranslations ] = result;

		const untranslatedWordList = [];
		let token, translation;
		for (i = 0; i < tokens.length; i++) {
			token = tokens[i]
			translation = cachedTranslations[i];

			if (translation) {
				token['translation'] = translation;
			} else {
				untranslatedWordList.push(token['text']['content']);
			}
		}

		// const translations = translate.translateText(untranslatedWordList, sourceLanguage);
		console.log('batching')
		const translations = [];
		let batch;
		for (i = 0; i < Math.ceil(untranslatedWordList.length / maxWords); i++) {
			batch = untranslatedWordList.slice(maxWords * i, maxWords * (i + 1));
			translations.push(translate.translateText(batch, sourceLanguage))
		}

		return Promise.all([sourceLanguage, tokens, Promise.all(translations)])
	}).then(result => {
		const [ sourceLanguage, tokens, translationResult ] = result;

		const translations = _.flattenDeep(translationResult.map(t => t[0]));
		const pronunciations = [];

		let token, word, isPunctuation;
		let translationIndex = 0;
		for (i = 0; i < tokens.length; i++) {
			token = tokens[i];
			word = token['text']['content'];

			if (!token['translation']) {
				token['translation'] = translations[translationIndex++];
			}

			if (stopwords.languageSupported(sourceLanguage)) {
				token['isStopword'] = stopwords.isStopword(token, sourceLanguage);
			}

			if (pronunciation.languageSupported(sourceLanguage)) {
				pronunciations.push(pronunciation.getPronunciation(word, sourceLanguage));
			}
		}

		return Promise.all([sourceLanguage, tokens, Promise.all(pronunciations)]);
	}).then(result => {
		const [ sourceLanguage, tokens, pronunciations ] = result;

		if (pronunciation.languageSupported(sourceLanguage)) {
			for (i = 0; i < tokens.length; i++) {
				tokens[i]['pronunciation'] = pronunciations[i];
			}
		}

		const mongoWords = tokens.map(token => query.word.createWord(token, sourceLanguage, targetLanguage));

		return Promise.all([sourceLanguage, tokens, Promise.all(mongoWords)]);
	}).then(result => {
		console.log("RESULT!", result)
		const [ sourceLanguage, tokens, mongoWords ] = result;

		const tokenMongoWordMap = mongoWords.reduce((map, word) => {
			console.log("!@23434323424", word)
			map[word.value['id']] = word.value;
			return map;
		}, {});

		console.log("tokenMongoWordMap")
		console.log(tokenMongoWordMap)

		let wordId;
		const orderedMongoWords = tokens.map(token => {
			console.log("TOKEN:", token)
			wordId = [sourceLanguage, targetLanguage, token['text']['content']].join('_');
			console.log("wordID:", tokenMongoWordMap[wordId])
			return tokenMongoWordMap[wordId];
		});

		return Promise.all([sourceLanguage, tokens, orderedMongoWords]);
	})
}

module.exports.processText = processText;
module.exports.getKeywords = keywords.getKeywords;

let text
// text = '我是一個漂亮的蝴蝶'
// text = 'Hola cómo estás'
// text = 'Suzanne et Joseph étaient nés dans les deux premières années de leur arrivée à la colonie. Après la naissance de Suzanne, la mère abandonna l’enseignement d’état. Elle ne donna plus que des leçons particulières de français. Son mari avait été nommé directeur d’une école indigène et, disaient-elle, ils avaient vécu très largement malgré la charge de leurs enfants. Ces années-là furent sans conteste les meilleures de sa vie, des années de bonheur. Du moins c’étaient ce qu’elle disait. Elle s’en souvenait comme d’une terre lointaine et rêvée, d’une île. Elle en parlait de moins en moins à mesure qu’elle vieillissait, mais quand elle en parlait c’était toujours avec le même acharnement. Alors, à chaque fois, elle découvrait pour eux de nouvelles perfections à cette perfection, une nouvelle qualité à son mari, un nouvel aspect de l’aisance qu’ils connaissaient alors, et qui tendaient à devenir une opulence dont Joseph et Suzanne doutaient un peu.'
// processText(text).then(result => {
// 	console.log(result[2])
// })

// tokenize.tokenizeText(text).then(r => console.log(r))

// let translation 
// translation = processText(text) //我是一個漂亮的蝴蝶。
// translation.then(result => {
// 	console.log('===== SOURCE LANGUAGE =====')
// 	console.log(result[0])
// 	console.log('===== TOKENS =====')
// 	console.log(result[1])
// 	console.log('===== MONGO WORDS =====')
// 	console.log(result[2])
// }).catch();

// translation = processText('かわいい犬が好き。')
// translation.then(result => console.log(result[1]));


// translation = processText('ブライアンくんは日本に行く。')
// translation.then(result => console.log(result[1]));

// text = ' В 1774 году лидеры американских колонистов отказались выполнять Массачусетский акт колониального правительства, изданный после событий Бостонского чаепития. Они сформировали временное правительство, известное как Массачусетский Конгресс, и призвали ополчение готовиться к возможному конфликту. В ответ в феврале 1775 года британское правительство объявило Массачусетс мятежной колонией. Отряд в 700 пехотинцев получил приказ секретно выдвинуться к городку Конкорд и уничтожить запасы оружия, которые находились там по донесениям шпионов. Колонисты узнали об этой экспедиции и успели заранее вывезти и спрятать всё оружие. Утром 19 апреля британский отряд вошёл в город Лексингтон и в завязавшейся перестрелке погибло восемь колонистов. Британцы вошли в Конкорд и приступили к поиску оружия. Около Северного моста Конкорда примерно 400 колонистов вступили в перестрелку с отрядом в 100 регуляров, что привело к жертвам с обеих сторон. Отряд отступил в Конкорд, соединился с остальными силами, и около полудня британцы начали марш к Бостону. Колонисты стреляли по ним со всех сторон и отряд едва дошёл до Лексингтона, где встретили пришедшую им на помощь бригаду лорда Перси. Объединённый отряд начал под огнём отступать к Бостону и сумел дойти до Чарльзтона. Вслед за этим ополченцы перекрыли подступы к Чарльзтону и Бостону, и началась осада Бостона.'
// text = [text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text].join(' ')
// text = 'Artikel 26 1. Jeder hat das Recht auf Bildung. Die Bildung ist unentgeltlich, zum mindesten der Grundschulunterricht und die grundlegende Bildung. Der Grundschulunterricht ist obligatorisch. Fach- und Berufsschulunterricht müssen allgemein verfügbar gemacht werden, und der Hochschulunterricht muß allen gleichermaßen entsprechend ihren Fähigkeiten offenstehen. 2. Die Bildung muß auf die volle Entfaltung der menschlichen Persönlichkeit und auf die Stärkung der Achtung vor den Menschenrechten und Grundfreiheiten gerichtet sein. Sie muß zu Verständnis, Toleranz und Freundschaft zwischen allen Nationen und allen rassischen oder religiösen Gruppen beitragen und der Tätigkeit der Vereinten Nationen für die Wahrung des Friedens förderlich sein. 3. Die Eltern haben ein vorrangiges Recht, die Art der Bildung zu wählen, die ihren Kindern zuteil werden soll.'
// translate.translateText(text, 'ru').then(result => console.log('translate: ' + result)).catch(err => console.log('translate failed: ' + err)).finally(console.log('translate finished'));
// tokenize.tokenizeText(text).then(result => console.log('tokenize ' + result)).catch(err => console.log('tokenize failed: ' + err)).finally(console.log('tokenize finished'));
// processText(text).then(result => console.log('translate: ' + result)).catch(err => console.log('translate failed: ' + err)).finally(console.log('translate finished'));
