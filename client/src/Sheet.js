import React from "react";
import ArticleDisplay from './ArticleDisplay';
import Container from './Container';
import VocabDisplay from './VocabDisplay';
import ReactTooltip from 'react-tooltip'
import {Button, Grid, Box} from 'grommet';
import {Download, Trash, Edit} from 'grommet-icons'

class Sheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: '',
      tokens: [],
      vocabRows: [],
    };
  }

    componentWillMount() {
      const url = '/document/' + this.props.match.params.id
      console.log('betch')
      fetch(url).then( (res) => res.json()).then((res) => {
        const getData = res
        console.log(getData)
        this.getArticle(getData.title, getData.plaintext, getData.article, getData.language);
        this.getVocabSheet(getData.vocab_list);
      })
    }

    getArticle(title, article, tokens, language) {
      this.setState({
        title: title,
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
        <Container title={this.state.title} description="Your generated vocab sheet">
          <Grid
          rows={['xxsmall','small' ]}
          columns={['1/2', '1/2']}
          gap="small"
          areas={[
            { name: 'menu', start: [0,0], end:[1,0]},
            { name: 'article', start: [0, 1], end: [1, 1] },
            { name: 'vocab', start: [1, 1], end: [1, 1] },
          ]}
        >
            <Box gridArea="menu" alignContent="end" direction="row-reverse">
              <Button data-tip="Delete Sheet" icon={<Trash />} disabled color="black"/>
              <Button data-tip="Edit Sheet" icon={<Edit />} disabled color="black"/>
              <Button data-tip="Export to PDF" icon={<Download />} color="black"/>
            </Box>
            <Box gridArea="article">
              <ArticleDisplay 
                article={this.state.article} 
                tokens={this.state.tokens}
                />
            </Box>
            <Box gridArea="vocab" background="light-2">
              <VocabDisplay 
                vocabRows={this.state.vocabRows} 
                />
            </Box>
          </Grid>
          <ReactTooltip />
         </Container>
      )
    }
  }

  export default Sheet;


