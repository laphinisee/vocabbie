////////////////////// Begin Boilerplate ///////////////////////////
const express = require('express');
const app = express();

const path = require('path'); //for pathing
app.use(express.static('client/public')); 

const uuidv1 = require('uuid/v1'); //used to randomly generate ids

app.set('view engine', 'html');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const db = mongoose.connection;

db.on('error', console.error); // log any errors that occur

// bind a function to perform when the database has been opened
db.once('open', function() {
  // perform any queries here, more on this later
  console.log("Connected to DB!");
});

// process is a global object referring to the system process running this
// code, when you press CTRL-C to stop Node, this closes the connection
process.on('SIGINT', function() {
   db.close(function () {
       console.log('DB connection closed by Node process ending');
       process.exit(0);
   });
});

//TODO: Replace this with Alex's database
const url = //'mongodb+srv://brian_oppenheim:Resonance9!@cluster0-oatb9.mongodb.net/test?retryWrites=true';
mongoose.connect(url, {useNewUrlParser: true});
//TODO: Add Alex's Schema here

////////////////////////// End boilerplate //////////////////////////////
//Homepage
app.get('/', function(request, response){
  response.status(200).type('html');
  console.log('- request received:', request.method, request.url);
  
});

app.post('/generate', function(request, response) {
  /*POSTs text to generate vocab from, returns vocab as a JSON 
    dict from original word to translated value, along with a 
    string representing the language
  */
  //TODO: integrate with Alex's parser here
  let tokenizedLanguage = tokenize(request.body.stringToParse);
  //TODO: write naive findHardest.
  let hardestVocab = findHardestVocab(tokenizedLanguage);
  let translatedJson = {};
  for(let i = 0; i < hardestVocab.length(); i++){
    //TODO: integrate with Alex.
    let language = detectLanguage(hardestVocab[i]);
    let translatedText = translateText(hardestVocab[i], language);
   //[{"lettuce", ["esp", "lechuga"]}, {"paper": ["esp", "papel"]}
   //{
      // languate : spanish,
      // words : {
      //   lettucs : whatver
      //   water : agua
      // }
      // //}
    translatedJson.append(translatedText+language);
  }
  response.status(200).type('html');
  response.json(translatedJson);
});

app.post('/generate/save', function(request, response){
  /*POSTS all vocab cards that a user has selected to save from generation as above JSON.*/
  let vocabToSave = response.body.vocabToSave;
  
});
app.listen(8080)