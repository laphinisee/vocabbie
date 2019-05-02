const keyword_extractor = require('keyword-extractor');

const _ = require('lodash');

function getKeywords(text, max_words=20) {
  const keywords = new Set(keyword_extractor.extract(text, {
    remove_digits: true,
    return_changed_case: false,
    remove_duplicates: true
  }));
  
  let multiset = text.split(' ').filter(word => keywords.has(word))
  multiset = _.countBy(multiset, x => x.toString())

  const sortedKeywords = _.sortBy(Array.from(keywords), [(word) => { return -1 * multiset[word] }])
  return _.slice(sortedKeywords, 0, max_words)
}

module.exports = {
  getKeywords
};

// const text = 'Suzanne et Joseph étaient nés dans les deux premières années de leur arrivée à la colonie. Après la naissance de Suzanne, la mère abandonna l’enseignement d’état. Elle ne donna plus que des leçons particulières de français. Son mari avait été nommé directeur d’une école indigène et, disaient-elle, ils avaient vécu très largement malgré la charge de leurs enfants. Ces années-là furent sans conteste les meilleures de sa vie, des années de bonheur. Du moins c’étaient ce qu’elle disait. Elle s’en souvenait comme d’une terre lointaine et rêvée, d’une île. Elle en parlait de moins en moins à mesure qu’elle vieillissait, mais quand elle en parlait c’était toujours avec le même acharnement. Alors, à chaque fois, elle découvrait pour eux de nouvelles perfections à cette perfection, une nouvelle qualité à son mari, un nouvel aspect de l’aisance qu’ils connaissaient alors, et qui tendaient à devenir une opulence dont Joseph et Suzanne doutaient un peu.'
// console.log(getKeywords(text))
