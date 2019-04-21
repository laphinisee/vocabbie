////////////////////// Begin Boilerplate //////////////////////
const express = require('express');
const app = express();

const path = require('path'); //for pathing
app.use(express.static('client/public')); 

const uuidv1 = require('uuid/v1'); //used to randomly generate ids

app.set('view engine', 'html');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const nlp = require('./src/nlp/nlpMain');
const querydb = require('./src/db/query');
const keyword_extractor = require("keyword-extractor");
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
  queryDB.getDocument(documentID).then(result =>{
    const article = [];
    const vocab_list = {};
    const srclanguage = result.text.sourceLanguage;
    const paragraphs = result.text.allWords;
    const keyWords = result.text.keyWords;
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
  });

app.post('/generate-text', function(request, response) {
  const topWords = rankText(request.body.text, 20);
  const title = request.body.title
  const allWords = [];
  const keywords = [];
  const translatedJson = nlp.processText(request.body.text);

  translatedJson.then(result => {
    [ srcLanguage, translatedWords ] = result;
    allWords.push(translatedWords);
    translatedWords.forEach(function(w){
      let hardId = "";
      if(topWords.indexOf(w.lemma) !== -1) {
        hardId = topWords.indexOf(w.lemma);
        keywords[hardId] = w;
      }
    });
    // call db function to save all words.
    querydb.document.createDocument(/*name*/ "", /*ownerId*/ "", request.body.text, srcLanguage, "en", allWords, keywords);
    response.status(200).send();
  })

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
	});
	response.status(200).type('html');
	response.json({titles : titles, ids : ids, previews : previews});
});
app.post('/login', function(request, response){
  //TODO do passport stuff :3. 
})

function rankText(text, thresh){
  const allKeyWords = keywords(text);
  //Return the longest words as a proxy. 
  allKeyWords.sort(function(a, b){
    return b.length - a.length;
  });
  const hardestWords = allKeyWords.splice(0, thresh);
  return Array.from(new Set(hardestWords))
}

function keywords(text) {
  return keyword_extractor.extract(text, {
    language: 'english',
    remove_digits: true,
    return_changed_case: false,
    remove_duplicates: true
  })
}

app.listen(8080);
