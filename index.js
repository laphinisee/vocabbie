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
////////////////////// End boilerplate //////////////////////

/* Backend TODOS
   1. query for allWords with GetWordsQuery from Alex (AllWords is currently a list of strings)
   2. Revert back and get the processAndSaveText
   3. Integrate pdf parsing and url parsing methods abstracted out
   4. set up db auth and test text generation end points. 
   5. ERROR CHECKING !!!
*/
////////////////////////// LOGIN LOGIC /////////////////////////////////////////
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./keys/keys");


const Users = require('./src/db/utils/schemas/userSchema').Users;

app.post('/register', function(req, res) {
  querydb.user.getUserByEmail(req.body.email).then(user => {
    if (user) {
      return res.status(200).json({ error: "Email already exists" });
    } 

    querydb.user.createUser(req.body.name, req.body.email, req.body.password);
  });
});

const passport = require('passport');
require('./passport')(passport)
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

///////////////////////// ENDPOINTS /////////////////////////
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
    return querydb.documentText.getDocumentText(textId);
  }).then(result => {
    console.log(result)
    const article = [];
    const vocab_list = {};
    const srclanguage = result.sourceLanguage;
    const allWordPromise = querydb.word.getWords(result.allWords,  result.sourceLanguage, result.targetLanguage)
    allWordPromise.then(allWords=> {
      console.log(allWords);
      const keyWordPromise = querydb.word.getWords(result.keyWords,  result.sourceLanguage, result.targetLanguage)
      keyWordPromise.then(keyWords => {
        allWords.forEach(function(w){
          console.log("w:", typeof w, w)
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
        response.json(toReturn);
      })
    })
  })
});


app.post('/generate-text', function(request, response, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (user) {
      const title = request.body.title;
      const text = scrapeURL(request.body.url);
      processAndSaveText(text, title, response);
    } else {
      response.status(401).send()
    }
  })(request, response, next);
});

app.post('/generate-pdf', function(request, response){
  // entry point for uploading a pdf file
  upload(req, res, function(err){
    if (err) {
      return res.end("could not upload the file");
    }
    let pdfParser = new PDFParser(this,1);
    let scrapedText = "";
   
      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
          scrapedText = pdfParser.getRawTextContent();
          const title = request.body.title;
          processAndSaveText(scrapedText, title, response);
      });
    
      pdfParser.loadPDF("./uploads/" + req.file.filename);
  }); 
});

app.post('/generate-url', function(request, response){
  scrapeURL(request.body.url).then(allText => {
    if(allText == "ERR: Invalid URL"){
      response.status(500).send();
      return;
    }
    const title = request.body.title;
    processAndSaveText(allText, title, response);
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
  });
  response.status(200).type('html');
  response.json({titles : titles, ids : ids, previews : previews});
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
  const translatedJson = nlp.processText(text);
  translatedJson.then(result => {
    [ srcLanguage, translatedWords, allWords ] = result;

    const whitespaceSeparatedWords = allWords.filter(word => !word['isStopword']).map(word => word['originalText']).join(' ')

    const keywordsPlaintext = getKeywords(whitespaceSeparatedWords);

    keywords = Array.from(new Set(allWords)).filter(word => keywordsPlaintext.has(word['originalText']));

    // call db function to save all words.
    const promise = querydb.document.createDocument(title, mongoose.Types.ObjectId(), text, srcLanguage, "en", allWords, keywords);


    promise.then(result => {
      console.log(result);
      const id = result['_id'];
      console.log(id);
      response.status(200).type('html');
      response.json(id);
    });
  });
}
function scrapeURL(url){
  let allText = "";
  const textElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'];
  return axios.get(url).then((response) => {
    //TODO check promise rejection
    // Load the web page source code into a cheerio instance
    const $ = cheerio.load(response.data);
    allText = textElements.map(element => $(element).text()).join(' ');
    // console.log(allText);
    return allText;
  }).catch(err => {
    return "ERR: Invalid URL";
  });
}
function getKeywords(text) {
  return new Set(keyword_extractor.extract(text, {
    // language: 'english',
    remove_digits: true,
    return_changed_case: false,
    remove_duplicates: true
  }));
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