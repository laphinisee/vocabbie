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
const querydb = require('src/db/query.js');
////////////////////// End boilerplate //////////////////////


app.get('/', function(request, response){
  response.status(200).type('html');
  console.log('- request received:', request.method, request.url);
  
});
app.get('/document/:id', function(request, response){
  //Return JSON of Article, Defintions, Vocab_List
  //Article is list of all tokens to their definitions and id if they're in hardest.
  //vocab _list is mapping of id in Article to saved word cache objects.
  const documentID = response.body.id;
  const Document = AlexDB.getDocument(documentID); //TODO replace with real code.
  const article = [];
  const vocab_list = {};
  const srclanguage = Document.text.sourceLanguage;
  const paragraphs = Document.text.allWords;
  const keyWords = Document.text.keyWords;
  paragraphs.forEach(function(p){
    const new_paragraph = [];
    p.forEach(function(w){
      let hardId = keyWords.findIndex(word => word.lemma == w.lemma);
      new_paragraph.push({token : w.lemma, def : w.translation, id : hardId});
    });
    article.push(new_paragraph);
  });
  for(let i = 0 ; i < keyWords.length; i++){
    vocab_list.set(i, {"text": w.lemma, "pos": w.partOfSpeech, "translation": w.translation});
  }
  const toReturn = {
    article : article,
    vocab_list : vocab_list,
    language : srclanguage
  };
  response.status(200).type('html');
  response.json(toReturn);
});

app.post('/generate-text', function(request, response) {
  const topWords = rankText(request.body.text);
  const allWords = [];
  const keywords = [];
  const translatedJson = processText(request.body.text);
  const srclanguage = translatedJson[0];
  const translatedWords = translatedJson[1];
  allWords.push(translatedWords);
  translatedWords.forEach(function(w){
  	let hardId = "";
  	if(topWords.indexOf(w.lemma) !== -1) {
  		hardId = topWords.indexOf(w.lemma);
  		keywords[hardId] = w;
  	}
  });

  // call db function to save all words.
  querydb.createDocument(/*name*/ "", /*ownerId*/ "", request.body.text, srcLanguage, "en", allWords, keywords);
  response.status(200).send();
});

app.post('/:userid/vocab', function(request, response){
	const titles = [];
	const ids = [];
	const previews = [];
	querydb.getUserDocuments(request.params.userid)
	.then(result => (){
		// list of {name : ?, _id : ?, text.plaintext : ?}
		titles.push(result.name);
		ids.push(result._id);
		let len = result.text.plaintext.length > 100 ? 100 : result.text.plaintext.length;
		previews.push(result.text.plaintext.substring(0, len));
	});
	response.status(200).type('html');
	response.json({titles : titles, ids : ids, previews : previews});
});

app.get('/*/settings', function(request, response){
//get the user id and retrieve their settings information.
  SettingsDatabase.retrieve(id);
  response.status(200).type('html');
});


function rankText(text, thresh){
  const allText = text.split("/\s+/");
  //Return the longest words as a proxy. 
  allText.sort(function(a, b){
    return b.length - a.length;
  });
  const hardestWords = allText[0:thresh];
  return list(set(hardestWords));
}

app.listen(8080);
