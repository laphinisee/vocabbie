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
  // POSTs text to generate vocab from, returns vocab as a JSON 
  // dict from original word to translated value, along with a 
  // string representing the language

  const article = [];
  const	vocab_list = {}
  const topWords = rankText(request.body.text);
  const paragraphs = request.body.text.split('[\r\n]+');
  paragraphs.forEach(function(p){
  	const translatedWords = processText(p)[1];
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
  	vocab_list : vocab_list;
  };

  response.status(200).type('html');
  response.json(toReturn);
});

app.post('/:userid/vocab', function(request, response){
  /*POSTS all vocab cards that a user has selected to save from generation as above JSON.*/
  let vocabToSave = response.body.vocabToSave;
  
});


app.get('/sheet/:sheetid', function(request, response){

});

app.listen(8080)