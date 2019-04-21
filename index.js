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
  const keyWords = rankText(request.body.text);
  const paragraphs = request.body.text.split('[\r\n]+');
  let srclanguage = "";
  const vocabList = {};
  const allWords = [];
  paragraphs.forEach(function(p){
  	const translatedJson = processText(p);
  	srclanguage = translatedJson[0];
    const translatedWords = translatedJson[1];
    allWords.push(translatedWords);
    translatedWords.forEach(function(w){
      let hardId = "";
      if(topWords.indexOf(w.lemma) !== -1) {
        hardId = topWords.indexOf(w.lemma);
        vocab_list[hardId] = w;
      }
    });
  });
  //TODO communicate with Alex/Lucy/Jacob how we'll get the rest of the information. (title, uuid, etc.)
  const DocumentTextToSave = {
    hash: ,//What to doAlex?,
    plaintext: ,//What to doAlex?,
    sourceLanguage : srclanguage,
    targetLanguage : "en", //TODO maybe come back to this?
    allWords: allWords,
    keyWords : vocabList
  }
  const documentToSave = {
  	text: DocumentTextToSave,
  	name : ,//How to get title from Jacob/Lucy?,
  	owner : ,//How to get uuid from Jacob/Lucy
    sharedUsers : , //What to do Alex?
    StudyMats: {}
  };
  //TODO: call db function to save all words.

  response.status(200).type('html');
});

app.post('/:userid/vocab', function(request, response){

	const userdid = request.params.userid;
	let vocabToSave = response.body.vocabToSave;
	// call db function to get a list of documents (title + preview) associated with this user 
	response.status(200).type('html');
	response.json(toReturn);
});
app.get('/*/settings', function(request, response){
//get the user id and retrieve their settings information.
  SettingsDatabase.retrieve(id);
  response.status(200).type('html');
});
app.post('/login', function(request, response){
  //TODO do passport stuff :3. 
})

function rankText(text, thresh){
  const allText = text.split("/\s+/");
  //Return the longest words as a proxy. 
  allText.sort(function(a, b){
    return b.length - a.length;
  });
  const hardestWords = allText[0:thresh];
  return list(set(hardestWords));
}
app.listen(8080)