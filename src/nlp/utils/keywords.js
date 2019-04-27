
const keyword_extractor = require('keyword-extractor');

function getKeywords(text) {
  return new Set(keyword_extractor.extract(text, {
    remove_digits: true,
    return_changed_case: false,
    remove_duplicates: true
  }));
}

module.exports = {
  getKeywords
};
