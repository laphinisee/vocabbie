////////////////////// Begin Boilerplate //////////////////////
const express = require('express');
const app = express();

const path = require('path'); //for pathing
app.use(express.static('client/public')); 

const uuidv1 = require('uuid/v1'); //used to randomly generate ids

app.set('view engine', 'html');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const nlp = require('src/nlp')
////////////////////// End boilerplate //////////////////////


app.get('/', function(request, response){
  response.status(200).type('html');
  console.log('- request received:', request.method, request.url);
  
});

app.post('/generate-text', function(request, response) {
  const article = [];
  const	vocab_list = {}
  const topWords = rankText(request.body.text);
  const paragraphs = request.body.text.split('[\r\n]+');
  let srclanguage = "";
  paragraphs.forEach(function(p){
  	const translatedJson = processText(p);
  	srclanguage = translatedJson[0];
  	const translatedWords = translatedJson[1];
  	const new_paragraph = [];
  	translatedWords.forEach(function(w){
  		let hardId = "";
  		if(topWords.indexOf(w.lemma) !== -1) {
  			hardId = topWords.indexOf(w.lemma);
  			vocab_list[hardId] = w;
  		}
  		new_paragraph.push({token : w.lemma, def : w.translation, id : hardId});
  	});
  });

  const toReturn = {
  	article : article,
  	vocab_list : vocab_list,
  	language : srclanguage
  };
  // call db function to save all words?

  response.status(200).send();
});

app.post('/:userid/vocab', function(request, response){
	const usedid = request.params.userid;
	let vocabToSave = response.body.vocabToSave;
	// call db function to get a list of documents (title + preview) associated with this user 
	response.status(200).type('html');
	response.json(toReturn);
});


app.get('/sheet/:sheetid', function(request, response){

});

app.listen(8080)