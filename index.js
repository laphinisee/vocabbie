////////////////////// Begin Boilerplate //////////////////////
const express = require('express');
const app = express();

const path = require('path'); //for pathing
app.use(express.static('client/public')); 
app.set('view engine', 'html');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
////////////////////// LOGIN LOGIC //////////////////////
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./keys/keys");


const Users = require('./src/db/utils/schemas/userSchema').Users;
const passport = require('passport');
require('./passport')(passport)
app.use(passport.initialize());

app.post('/register', function(req, res) {
  querydb.user.getUserByEmail(req.body.email).then(user => {
    if (user) {
      return res.status(200).json({ error: "Email already exists" });
    } 

    const newUser = querydb.user.createUser(req.body.name, req.body.email, req.body.password, (user) => {
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
    });
  });
});

app.post('/login', function(req, res){
  Users.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return response.status(200).json({ error: "Incorrect email and/or password." });
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

////////////////////// ENDPOINTS //////////////////////
app.get('/', function(request, response){
  response.status(200).type('html');
  console.log('- request received:', request.method, request.url);
  
});

app.get('/document/:id', function(request, response){
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const documentID = mongoose.Types.ObjectId(request.params.id);
      let title = ""
      let allWords;
      const article = [];
      const vocab_list = {};
      let srclanguage = "";
      let plaintext = "";
      let targetlanguage = "";
      let keyWordsStrings;
      querydb.document.getDocument(documentID)
      .then(doc => {
        title = doc.name;
        const textId = mongoose.Types.ObjectId(doc.textId);
        return querydb.documentText.getDocumentText(textId);
      }).then(result => {
        srclanguage = result.sourceLanguage;
        plaintext = result.plaintext;
        targetlanguage = result.targetLanguage;
        keyWordsStrings = result.keyWords;
        return querydb.word.getWords(result.allWords,  srclanguage, targetlanguage);
      }).then(allwordsTemp => {
        allWords = allwordsTemp;
        // keyWordPromise
        return querydb.word.getWords(keyWordsStrings,  srclanguage, targetlanguage)
      }).then(keyWords => {
        allWords.forEach(function(w){
          let hardId = keyWords.findIndex(word => word.lemma == w.lemma);
          article.push({str : w.originalText, lemma: w.lemma, def : w.translatedText, id : hardId});
        });
        for(let i = 0 ; i < keyWords.length; i++){
          vocab_list[i] = {"text": keyWords[i].lemma, "pos": keyWords[i].partOfSpeech, "translation": keyWords[i].translatedText};
        }
        const toReturn = {
          title : title,
          plaintext : plaintext, 
          article : article,
          vocab_list : vocab_list,
          language : srclanguage
        };
        response.status(200).type('application/json');
        response.json(toReturn);
      }).catch(err => {
          // should catch any error from previous chains
          console.log(err)
          response.status(500).send();
      });
    } else {
      response.status(401).send()
    }
  })(request, response, next); 
});


app.post('/generate-text', function(request, response, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
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
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
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
    } else {
      response.status(401).send()
    }
  })(request, response, next); 
});

app.post('/generate-url', function(request, response){
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
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
    } else {
      response.status(401).send()
    }
  })(request, response, next);  
});

app.get('/vocab', function(request, response, next){
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
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
              const len = Math.min(dt.plaintext.length, 1000);
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
  .then(result => {
    const [ srcLanguage, translatedWords, allWords ] = result;

    const whitespaceSeparatedWords = allWords.filter(word => !word['isStopword']).map(word => word['originalText']).join(' ')
    const keywordsPlaintext = nlp.getKeywords(whitespaceSeparatedWords);
    keywords = Array.from(new Set(allWords)).filter(word => keywordsPlaintext.has(word['originalText']));
    // call db function to save all words.
    return querydb.document.createDocument(title, mongoose.Types.ObjectId(), text, srcLanguage, "en", allWords.map(word => word['originalText']), keywords.map(word => word['originalText']));
  }).then(result => {
    const id = result['_id'];
    response.status(200).type('html');
    response.json({id: id});
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

function rankText(text, thresh) {
  const allKeyWords = keywords(text);
  //Return the longest words as a proxy. 
  allKeyWords.sort(function(a, b){
    return b.length - a.length;
  });
  const hardestWords = allKeyWords.splice(0, thresh);
  return Array.from(new Set(hardestWords))
}

app.listen(8080);
