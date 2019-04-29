const server = require('../server');

const app = server.app,
	query = server.query;

const mongoose = require('mongoose');

app.get('/document/:id', function(request, response){
  //Return JSON of Article, Defintions, Vocab_List
  //Article is list of all tokens to their definitions and id if they're in hardest.
  //vocab _list is mapping of id in Article to saved word cache objects.
  
  // const documentID = mongoose.Types.ObjectId(request.params.id);
  // let title = "";
  // querydb.document.getDocument(documentID).then(doc => {
  //   console.log(doc)
  //   title = doc.name;
  //   const textId = mongoose.Types.ObjectId(doc.textId);
  //   return querydb.documentText.getDocumentText(textId);
  // }).then(result => {
  //   console.log(result)
  //   const article = [];
  //   const vocab_list = {};
  //   const srclanguage = result.sourceLanguage;
  //   const allWordPromise = querydb.word.getWords(result.allWords,  result.sourceLanguage, result.targetLanguage)
  //   allWordPromise.then(allWords=> {
  //     const keyWordPromise = querydb.word.getWords(result.keyWords,  result.sourceLanguage, result.targetLanguage)
  //     keyWordPromise.then(keyWords => {
  //       allWords.forEach(function(w){
  //         console.log("w:", typeof w, w)
  //         let hardId = keyWords.findIndex(word => word.lemma == w.lemma);
  //         article.push({str : w.originalText, lemma: w.lemma, def : w.translatedText, id : hardId});
  //       });
  //       for(let i = 0 ; i < keyWords.length; i++){
  //         vocab_list[i] = {"text": keyWords[i].lemma, "pos": keyWords[i].partOfSpeech, "translation": keyWords[i].translatedText};
  //       }
  //       const toReturn = {
  //         title : title,
  //         plaintext : result.plaintext, 
  //         article : article,
  //         vocab_list : vocab_list,
  //         language : srclanguage
  //       };
  //       response.status(200).type('application/json');
  //       response.json(toReturn);
  //     })
  //   })
  // })

  const documentID = mongoose.Types.ObjectId(request.params.id);
  let title = ""
  let allWords;
  const article = [];
  const vocab_list = {};
  let srclanguage = "";
  let plaintext = "";
  let targetlanguage = "";
  let keyWordsStrings;
  query.document.getDocument(documentID)
  .then(doc => {
  	title = doc.name;
	const textId = mongoose.Types.ObjectId(doc.textId);
	return query.documentText.getDocumentText(textId);
  }).then(result => {
	srclanguage = result.sourceLanguage;
	plaintext = result.plaintext;
	targetlanguage = result.targetlanguage;
	keyWordsStrings = result.keyWords;
	// allWordPromise
	return query.word.getWords(result.allWords,  srclanguage, targetlanguage)
  }).then(allwordsTemp => {
	allWords = allwordsTemp;
	// keyWordPromise
	return query.word.getWords(keyWordsStrings,  srclanguage, targetlanguage)
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
});