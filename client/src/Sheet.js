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
      this.getArticle();
      this.getVocab();
    }

    getArticle() {
      this.setState({article: "I mangered my food and I touchered my blanket."})
      // Should set this up mad lib style so that we can connect words in article with
      // vocab row entries.
    }

    getVocab() {
      this.setState({vocabRows: [{original: "manger", partOfSpeech: "verb", translated: "to eat"},
      {original: "toucher", partOfSpeech: "verb", translated: "to touch"}]})
    }

    render() {
      return (
        <Container title="Your Vocabulary" description="Your generated vocab sheet">
          <Grid
          rows={['full']}
          columns={['1/2', '1/2']}
          gap="small"
          fill="true"
          areas={[
            { name: 'article', start: [0, 0], end: [1, 0] },
            { name: 'vocab', start: [1, 0], end: [1, 0] },
          ]}
        >
            <Box gridArea="article" background="light-2">
              <ArticleDisplay content={this.state.article} />
            </Box>
            <Box gridArea="vocab" background="light-5">
              <VocabDisplay vocabRows={this.state.vocabRows} />
            </Box>
          </Grid>
         </Container>
      )
    }
  }

  export default Sheet;


