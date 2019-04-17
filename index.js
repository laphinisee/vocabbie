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

app.post('/user/generate-text', function(request, response) {
  /*POSTs text to generate vocab from, saves vocab as a JSON 
    dict from original word to translated value, along with a 
    string representing the language
  */
  let translatedText = translateText(request.body.hardestVocab);
  //Save all text as StudyMat in DB
  response.status(200).type('html');
  response.json("no err");
});
app.get('/sheet/:id', function(request, response){
  //Return JSON of Article, Defintions, Vocab_List
  //Article is list of all tokens to their definitions and id if they're in hardest.
  //vocab _list is mapping of id in Article to saved word cache objects.
  let id = request.params.id;
  let studyMats = db.getStudyMat(id);
  response.json([StudyMats.words, StudyMats.vocab]);
});
app.post('/generate/save', function(request, response){
  /*POSTS all vocab cards that a user has selected to save from generation as above JSON.*/
  let vocabToSave = response.body.vocabToSave;
  //TODO save in Alex's database lol
  AlexDatabase.save(vocabToSave);
  response.status(200).type('html');
});
app.get('/*/settings', function(request, response){
//get the user id and retrieve their settings information.
  SettingsDatabase.retrieve(id);
  response.status(200).type('html');
});
app.post('/user/vocab', function(request, response){
  /*Return titles and ids for all StudyMats*/
  //below should return all studyMats
  AlexDatabase.retrieve(user+studymats);
  //now return ids and titles of studymats.
  response.status(200).type('html');
});


function rankText(text, thresh){
  let allText = text.split("/\s+/");
  //Return the longest words as a proxy. 
  allText.sort(function(a, b){
    return b.length - a.length;
  });
  return allText[0:thresh];
}
app.listen(8080)