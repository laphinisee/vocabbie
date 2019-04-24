const cheerio = require('cheerio')
const axios = require('axios')

const textElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'];
axios.get('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States').then((response) => {
  // Load the web page source code into a cheerio instance
  const $ = cheerio.load(response.data);
  const allText = textElements.map(element => $(element).text()).join(' ');
  return 
});
