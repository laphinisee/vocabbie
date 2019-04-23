////////////////////// Begin Boilerplate //////////////////////
const express = require('express');
const app = express();

const path = require('path'); //for pathing
app.use(express.static('client/public')); 
app.set('view engine', 'html');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const nlp = require('./src/nlp/nlpMain');
const querydb = require('./src/db/query');
const keyword_extractor = require("keyword-extractor");
////////////////////// End boilerplate //////////////////////

function getKeywords(text) {
  return new Set(keyword_extractor.extract(text, {
    // language: 'english',
    remove_digits: true,
    return_changed_case: false,
    remove_duplicates: true
  }));
}

app.get('/', function(request, response){
  response.status(200).type('html');
  console.log('- request received:', request.method, request.url);
  
});
app.get('/document/:id', function(request, response){
  //Return JSON of Article, Defintions, Vocab_List
  //Article is list of all tokens to their definitions and id if they're in hardest.
  //vocab _list is mapping of id in Article to saved word cache objects.
  const documentID = mongoose.Types.ObjectId(request.params.id);
  let title = "";
  querydb.document.getDocument(documentID).then(doc => {
    console.log(doc)
    title = doc.name;
    const textId = mongoose.Types.ObjectId(doc.textId);
    return querydb.documentText.getDocumentText(textId)
  }).then(result => {
    console.log(result)
    const article = [];
    const vocab_list = {};
    const srclanguage = result.sourceLanguage;
    const keyWords = result.keyWords;
    result.allWords.forEach(function(w){
      let hardId = keyWords.findIndex(word => word.lemma == w.lemma);
      article.push({str : w.originalText, lemma: w.lemma, def : w.translatedText, id : hardId});
    });
    for(let i = 0 ; i < keyWords.length; i++){
      vocab_list[i] = {"text": keyWords[i].lemma, "pos": keyWords[i].partOfSpeech, "translation": keyWords[i].translatedText};
    }
    const toReturn = {
      title : title,
      plaintext : result.plaintext,	
      article : article,
      vocab_list : vocab_list,
      language : srclanguage
    };
    response.status(200).type('application/json');
    // console.log("==========")
    // console.log(keyWords)
    response.json(toReturn);
  })
  });

app.post('/generate-text', function(request, response) {
  // const topWords = rankText(request.body.text, 20);
  const title = request.body.title
  let keywords;
  const text = request.body.text
  const translatedJson = nlp.processText(text);
  translatedJson.then(result => {
    [ srcLanguage, translatedWords, allWords ] = result;

    // translatedWords.forEach(function(w){
    //   let hardId = "";
    //   if(topWords.indexOf(w.lemma) !== -1) {
    //     hardId = topWords.indexOf(w.lemma);
    //     keywords[hardId] = w;
    //   }
    // });

    const whitespaceSeparatedWords = allWords.filter(word => !word['isStopword']).map(word => word['originalText']).join(' ')

    const keywordsPlaintext = getKeywords(whitespaceSeparatedWords);

    keywords = Array.from(new Set(allWords)).filter(word => keywordsPlaintext.has(word['originalText']));

    // call db function to save all words.
    const promise = querydb.document.createDocument(title, mongoose.Types.ObjectId(), request.body.text, srcLanguage, "en", allWords, keywords);
    
    /**
     * TODO: all promises need catches that gracefully return
     * error messages to users.
     */

    promise.then(result => {
      console.log(result);
      const id = result['_id'];
      console.log(id);
      response.status(200).type('application/json');
      response.json(id);
    });
  })

});

app.get('/:userid/vocab', function(request, response){
	// const titles = [];
	// const ids = [];
  // const previews = [];
  const docs = []
  querydb.document.getAllUserDocuments(mongoose.Types.ObjectId(request.params.userid))
  // querydb.document.getUserDocuments(mongoose.Types.ObjectId(request.params.userid))
	.then(result => {
    /**
     * TODO: Error checking - len variable line fails if there are no resulting documents.
     */
		// list of {name : ?, _id : ?, text.plaintext : ?}
		// titles.push(result.name);
    // ids.push(result._id);
    result.forEach((d) => {
      let doc = {}
      if (d.text) {
        const len = d.text.plaintext.length > 100 ? 100 : d.text.plaintext.length;
        doc = {title: d.name, id: d._id, preview: d.text.plaintext.substring(0, len)}
      } else {
        doc = {title: d.name, id: d._id}
      }
      docs.push(doc)
      response.status(200).type('application/json');
      // response.json({titles : titles, ids : ids, previews : previews});
      console.log(docs)
      response.json(docs)
    })
		// previews.push(result.text.plaintext.substring(0, len));
	});
	
});



const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./keys/keys");


const Users = require('./src/db/utils/schemas/userSchema').Users;

app.post('/register', function(req, res) {
  Users.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(200).json({ error: "Email already exists" });
    } 

    console.log("req.body", req.body)

    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

const passport = require('passport');
require('./passport');
app.use(passport.initialize());

app.post('/login', function(req, res){
  Users.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(200).json({ error: "Incorrect email and/or password." });
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              name: user.name,
              email: user.email,
              id: user.id,
            });
          }
        );

      } else {
        return res
          .status(200)
          .json({ error: "Incorrect email and/or password." });
      }
    });
  });
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

app.listen(8080);
