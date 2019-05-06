////////////////////// Begin Boilerplate //////////////////////
const express = require('express');
const app = express();

const path = require('path'); //for pathing
app.use(express.static(path.join(__dirname, 'client', 'build'))); 
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
const upload = multer({storage : storage}).single('file');

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
*/
////////////////////// LOGIN LOGIC //////////////////////
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./keys/keys");


const Users = require('./src/db/utils/schemas/userSchema').Users;
const passport = require('passport');
require('./passport')(passport)
app.use(passport.initialize());

app.post('/api/register', function(req, res) {
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

app.post('/api/login', function(req, res){
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

////////////////////// ENDPOINTS //////////////////////

app.get('/api/document/:id', function(request, response, next){
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const documentID = mongoose.Types.ObjectId(request.params.id);
      querydb.document.hasPermission(documentID, mongoose.Types.ObjectId(user._id))
      .then(isPermitted => {
        if (!isPermitted) {
          response.status(401).send();
        } else {
          let title = ""
          let allWords;
          const article = [];
          const vocab_list = {};
          let srclanguage = "";
          let plaintext = "";
          let targetlanguage = "";
          let document;
          let savedWords;
          querydb.document.getDocument(documentID)
          .then(doc => {
            document = doc;
            title = doc.name;
            const textId = mongoose.Types.ObjectId(doc.textId);
            return querydb.documentText.getDocumentText(textId);
          }).then(result => {
            srclanguage = result.sourceLanguage;
            plaintext = result.plaintext;
            targetlanguage = result.targetLanguage;
            return querydb.word.getWords(result.allWords,  srclanguage, targetlanguage);
          }).then(allwordsTemp => {
            allWords = allwordsTemp;
            return querydb.studyMat.getStudyMat(document.studyMat)
          }).then(studyMat => {
            return querydb.word.getWords(studyMat.savedWords, srclanguage, targetlanguage)
          }).then(savedWords => {
              const dupes = {};
              savedWords = savedWords.filter(function(item){
                  const val = item['lemma'].toLowerCase();
                  const exists = dupes[val];
                  dupes[val] = true;
                  return !exists;
              });
            allWords.forEach(function(w) {
              let hardId = savedWords.findIndex(word => word.lemma == w.lemma);
              article.push({str : w.originalText, lemma: w.lemma, def : w.translatedText, isStopword : w.isStopword, pronunciation : w.pronunciation, id : hardId});
            });
            for(let i = 0 ; i < savedWords.length; i++){
              vocab_list[i] = {"str": savedWords[i].originalText, "text": savedWords[i].lemma, "pos": savedWords[i].partOfSpeech, "translation": savedWords[i].translatedText};
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
        }
      }).catch(err => {
        response.status(500).send();
      })
    } else {
      response.status(401).send()
    }
  })(request, response, next); 
});


app.post('/api/generate-text', function(request, response, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const title = request.body.title;
      const text = request.body.plainText
      return processAndSaveText(text, title, response, user._id);
    } else {
      response.status(401).send()
    }
  })(request, response, next);
});

app.post('/api/generate-pdf', function(request, response, next){
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      // entry point for uploading a pdf file
      
      upload(request, response, function(err) {
        if (err) {
          return response.status(500).send();
        }
        const pdfParser = new PDFParser(this, 1);
        let scrapedText = "";   
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
          scrapedText = pdfParser.getRawTextContent();
          const title = request.body.title;
          processAndSaveText(scrapedText, title, response, user._id);
          try {
            fs.unlinkSync('./uploads/' + request.file.filename);
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

app.post('/api/generate-url', function(request, response, next){
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
        return processAndSaveText(allText, title, response, user._id);
      }).catch(err => {
        response.status(500).send()
      });
    } else {
      response.status(401).send()
    }
  })(request, response, next);  
});

app.get('/api/vocab', function(request, response, next){
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const docs = []
      querydb.document.getUserDocuments(user._id)
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

app.post('/api/document/:id/delete', function(request, response, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // TODO: Check that the person adding is the owner of the sheet.
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const wordToDelete = request.body.word;
      const documentID = mongoose.Types.ObjectId(request.params.id);
      let sourceLanguage;
      let targetLanguage;
      let document;
      querydb.document.getDocument(documentID).then(doc => {
        document = doc
        const textId = mongoose.Types.ObjectId(doc.textId);
        return querydb.documentText.getDocumentText(textId);
      }).then(documentText => {
        sourceLanguage = documentText.sourceLanguage
        targetLanguage = documentText.targetLanguage
        return querydb.studyMat.getStudyMat(document.studyMat)
      }).then(studyMat => {
        return querydb.studyMat.removeWords(studyMat, [wordToDelete]);
      }).then(updatedMat => {
        return querydb.word.getWords(updatedMat.savedWords,  sourceLanguage, targetLanguage);
      }).then(savedWordObjs => {
        response.status(200).type('application/json');
        response.json(savedWordObjs.map(word => {return {"str": word.originalText, "text": word.lemma, "pos": word.partOfSpeech, "translation": word.translatedText}}));
      }).catch(err => {
        console.log(err)
        response.status(500).send()
      });
    } else {
      response.status(401).send()
    }
  })(request, response, next);
});
app.post('/api/document/:id/add', function(request, response, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // TODO: Check that the person adding is the owner of the sheet.
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const wordToAdd = request.body.word;
      const documentID = mongoose.Types.ObjectId(request.params.id);
      let sourceLanguage;
      let targetLanguage;
      let document;
      let currStudyMat;
      querydb.document.getDocument(documentID).then(doc => {
        document = doc;
        const textId = mongoose.Types.ObjectId(doc.textId);
        return querydb.documentText.getDocumentText(textId);
      }).then(documentText => {
        sourceLanguage = documentText.sourceLanguage;
        targetLanguage = documentText.targetLanguage;
        return querydb.studyMat.getStudyMat(document.studyMat)
      }).then(studyMat => {
        currStudyMat = studyMat
        return nlp.processTextWithSource(wordToAdd, sourceLanguage, targetLanguage);
      }).then(() => {
        return querydb.studyMat.addWords(currStudyMat, [wordToAdd]);
      }).then(updatedMat => {
        return querydb.word.getWords(updatedMat.savedWords,  sourceLanguage, targetLanguage);
      }).then(savedWordObjs => {
        response.status(200).type('application/json');
        response.json(savedWordObjs.map(word => {return {"str": word.originalText,"text": word.lemma, "pos": word.partOfSpeech, "translation": word.translatedText}}));
      }).catch(err => {
        console.error(err)
        response.status(500).send()
      });
      
    } else {
      response.status(401).send()
    }
  })(request, response, next);
});
app.post('/api/sheet/:id/delete', function(request, response, next){
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      response.status(500).send(err.message);
    } else if (user) {
      const documentID = mongoose.Types.ObjectId(request.params.id);
      querydb.document.deleteDocument(documentID).then(deleted => {
        response.status(200).send()
      }).catch( err => {
        console.error(err)
        response.status(500).send()
      });
    } else {
      response.status(401).send()
    }
  })(request, response, next);
});
app.post('/api/settings', function(request, response, next){
	passport.authenticate('jwt', {session : false}, (err, user, info) => {
		if (err) {
			response.status(500).send(err.message);
		} else if (user) {
      const onSuccess = () => { response.status(200).send() }
      const onFailure = () => { response.status(500).send() }
			querydb.user.updateUser(user._id, {password: request.body.password}, onSuccess, onFailure)
		}
	})(request, response, next);
});

function processAndSaveText(text, title, response, userId){
  let keywords;
  let id;
  let keyWords;
  let srcLanguage;
  let translatedWords;
  let allWords;
  let keywordsPlaintext
  nlp.processText(text)
  .then(result => {
    [ srcLanguage, translatedWords, allWords ] = result;

    const whitespaceSeparatedWords = allWords.filter(word => !word['isStopword']).map(word => word['originalText']).join(' ')
    keywordsPlaintext = nlp.getKeywords(whitespaceSeparatedWords);
    // call db function to save all words.
    return querydb.document.createDocument(title, userId, text, srcLanguage, "en", allWords.map(word => word['originalText']), keywordsPlaintext);
  }).then(doc => {
    id = doc['_id']; //TODO: filter down keyWords here.
    return querydb.studyMat.createStudyMat(srcLanguage, "en", keywordsPlaintext); 
  }).then(studyMat => {
    return querydb.document.addStudyMat(id, studyMat);
  }).then(result =>{
    response.status(200).type('html');
    response.json({id: id});
  }).catch(err => {
    // TODO: error 400 means they did eng->eng, but it could mean other things.
    // error code 3 means unsupported language. We should probably not assume
    // that the error is an unsupported language. 
    console.log(err)
    response.status(400).json({err: "The language you entered is not supported."});
  });
}

app.get('*', function(request, response){
  // response.status(200).type('html');
  response.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
});


function scrapeURL(url){
  let allText = "";
  const textElements = ['p', 'h1', 'h2'];
  return axios.get(url).then((response) => {
    // Load the web page source code into a cheerio instance
    const $ = cheerio.load(response.data);
    allText = textElements.map(element => $(element).text()).join(' ');
    return allText;
  }).catch(err => {
    return "ERR: Invalid URL";
  });
}

const port = process.env.VOCABBIE_PORT || 8080
console.log("Listening on...", port)
app.listen(port);
