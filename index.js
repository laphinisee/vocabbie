////////////////////// Begin Boilerplate //////////////////////
const path = require('path'); //for pathing

const multer = require('multer');
let storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./uploads");
	},
	filename: function(req, file, callback) {
		callback(null, Date.now() + "_" + file.originalname);
	}
});
let upload = multer({storage : storage});

const mongoose = require('mongoose');
const nlp = require('./src/nlp/nlpMain');
const querydb = require('./src/db/query');
const cheerio = require('cheerio');
const axios = require('axios');
const PDFParser = require('pdf2json');
const fs = require('fs');
////////////////////// End boilerplate //////////////////////

/* Backend TODOS
	 1. See result of keywords, and if it's too much for a large article, cut it down to be ~20. 
			1. b TF/IDF and/or length?
*/

////////////////////// ENDPOINTS //////////////////////


app.post('/generate-text', function(request, response, next) {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (user) {
			const title = request.body.title;
			const text = request.body.plainText
			return processAndSaveText(text, title, response);
		} else {
			response.status(401).send()
		}
	})(request, response, next);
});

app.post('/generate-pdf', function(request, response){
	// entry point for uploading a pdf file
	upload(request, response, function(err){
		if (err) {
			return response.status(500).send();
		}
		let pdfParser = new PDFParser(this, 1);
		let scrapedText = "";   
		pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
		pdfParser.on("pdfParser_dataReady", pdfData => {
			scrapedText = pdfParser.getRawTextContent();
			const title = request.body.title;
			return processAndSaveText(scrapedText, title, response);
			try {
				fs.unlinkSync('./uploads/' + request.file.filename);
				console.log('deleted ' + request.file.filename);
			} catch (err) {
				console.log('error deleting ' + request.file.filename);
			}
		});
		pdfParser.loadPDF("./uploads/" + request.file.filename);
	}); 
});

app.post('/generate-url', function(request, response){
	scrapeURL(request.body.url).then(allText => {
		if(allText == "ERR: Invalid URL"){
			response.status(500).send();
			return;
		}
		const title = request.body.title;
		return processAndSaveText(allText, title, response);
	}).catch(err => {
		response.status(500).send()
	});
});

app.post('/:userid/vocab', function(request, response){
	const titles = [];
	const ids = [];
	const previews = [];
	querydb.getUserDocuments(request.params.userid)
	.then(result => {
		// list of {name : ?, _id : ?, text.plaintext : ?}
		titles.push(result.name);
		ids.push(result._id);
		let len = result.text.plaintext.length > 100 ? 100 : result.text.plaintext.length;
		previews.push(result.text.plaintext.substring(0, len));
		response.status(200).type('html');
		response.json({titles : titles, ids : ids, previews : previews});
	}).catch(err => {
		response.status(500).send();
	});
});

app.get('/vocab', function(request, response, next){
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (user) {
			const docs = []
			querydb.document.getAllUserDocuments(mongoose.Types.ObjectId(request.params.userid))
			.then(result => {
				const allPromises = []
				result.forEach((d) => {
					allPromises.push(querydb.documentText.getDocumentText(mongoose.Types.ObjectId(d.textId)))
					let doc = {title: d.name, id: d._id}
						docs.push(doc)  
				})
				Promise.all(allPromises).then(
					dts => {
						dts.forEach((dt, i) => {
							const len = Math.min(dt.plaintext.length, 100);
							docs[i].preview = dt.plaintext.substring(0, len)
						})
						response.status(200).type('application/json');
						response.json(docs)
				})
			});
		} else {
			response.status(401).send()
		}
	})(request, response, next);
});

function processAndSaveText(text, title, response){
	let keywords;
	nlp.processText(text)
	.then(translatedJson => {
		[ srcLanguage, translatedWords, allWords ] = translatedJson;

		console.log("translatedJson:", translatedJson)
		const whitespaceSeparatedWords = allWords.filter(word => !word['isStopword']).map(word => word['originalText']).join(' ')
		const keywordsPlaintext = nlp.getKeywords(whitespaceSeparatedWords);
		keywords = Array.from(new Set(allWords)).filter(word => keywordsPlaintext.has(word['originalText']));
		// call db function to save all words.
		return querydb.document.createDocument(title, mongoose.Types.ObjectId(), text, srcLanguage, "en", allWords.map(word => word['originalText']), keywords.map(word => word['originalText']));
	}).then(result => {
		const id = result['_id'];
		response.status(200).type('html');
		response.json(id);
	}).catch(err => {
		console.log("err:", err)
		response.status(500).send();
	});
}

function scrapeURL(url){
	let allText = "";
	const textElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	return axios.get(url).then((response) => {
		// Load the web page source code into a cheerio instance
		const $ = cheerio.load(response.data);
		allText = textElements.map(element => $(element).text()).join(' ');
		return allText;
	}).catch(err => {
		return "ERR: Invalid URL";
	});
}

app.listen(8080);
