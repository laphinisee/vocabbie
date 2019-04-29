const cheerio = require('cheerio')
const axios = require('axios')

function scrapeURL(url){
  let allText = "";
  const textElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
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

scrapeURL('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States').then(r => console.log(r));
