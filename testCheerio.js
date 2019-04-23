const cheerio = require('cheerio')
const axios = require('axios')

axios.get('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States').then((response) => {
  // Load the web page source code into a cheerio instance
  const $ = cheerio.load(response.data);
  const allText = $('p').text() + " " + $('h1').text() + " " + $('h2').text() + " " + $('h3').text() + " " + $('h4').text() + " " +$('h5').text() + " " + $('h6').text();
  return 
});