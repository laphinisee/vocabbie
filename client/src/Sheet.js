import React from "react";
import ArticleDisplay from './ArticleDisplay';
import Container from './Container';
import VocabDisplay from './VocabDisplay';
import {Grid, Box} from 'grommet';

class Sheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

    componentWillMount() {

      const getData = {
        language: 'fr',
        vocabList: {
          1: {
            str: 'je',
            translated: 'i',
            pos: 'pronoun'
          },
        },
        tokens: [
          [ // Paragraph 1
            { // word 1
              str: 'je',
              translated: 'i',
              token_id: 1,
            },
            { // word 2
              str: 'manger',
              translated: 'to eat',
              token_id: 2,
            },
            { // word 3
              str: '.'
            }
          ],
          [ // Paragraph 2
            { // word 1
              str: 'je',
              translated: 'i',
              token_id: 3,
            },
            { // word not in vocab sheet
              str: 'toucher',
              translated: 'to touch',
              token_id: 4,
            }
          ]
        ],
        article: 'je manger. \n\n\n\n je toucher'
      }
      // GET CALL.. SEND ID, USER AUTH DETAILS, and GET JSON with Article and Vocab
      this.getArticle(getData.article, getData.tokens, getData.language);
      this.getVocabSheet(getData.vocabList);
    }

    getArticle(article, tokens, language) {
      this.setState({
        article: article,
        tokens: tokens,
        language: language
      })
      // Should set this up mad lib style so that we can connect words in article with
      // vocab row entries.
    }

    getVocabSheet(vocabRows) {
      this.setState({vocabRows})
    }

    render() {
      return (
        <Container title="Your Vocabulary" description="Your generated vocab sheet">
          <Grid
          rows={['full']}
          columns={['1/2', '1/2']}
          gap="small"
          areas={[
            { name: 'article', start: [0, 0], end: [1, 0] },
            { name: 'vocab', start: [1, 0], end: [1, 0] },
          ]}
        >
            <Box gridArea="article" background="light-2">
              <ArticleDisplay 
                article={this.state.article} 
                tokens={this.state.tokens.flat()}
                />
            </Box>
            <Box gridArea="vocab" background="light-5">
              <VocabDisplay 
                vocabRows={this.state.vocabRows} 
                />
            </Box>
          </Grid>
         </Container>
      )
    }
  }

  export default Sheet;


