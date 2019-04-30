import React from "react";
import ArticleDisplay from './ArticleDisplay';
import Container from './Container';
import VocabDisplay from './VocabDisplay';
import PDFSheet from './PDFSheet'
import ReactTooltip from 'react-tooltip'
import {Button, Grid, Box} from 'grommet';
import {Download, Trash, Edit} from 'grommet-icons'
import {PDFViewer} from '@react-pdf/renderer';
import { withRouter } from "react-router";

const EditMenu = (props) => {
  if (props.editMode) {
    // Add in text field to add Words
    return (<Button label="Finish editing" onClick={props.toggle} />)
  } else {
    return null
  }
}

class Sheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: '',
      tokens: [],
      vocabRows: [],
      selected: null,
      pdfReady: false,
      loading: true,
      editMode: false,
    };
  }

    componentWillMount() {
      const url = '/document/' + this.props.match.params.id
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.props.user.token,
        },
      }).then( (res) => res.json()).then((res) => {
        const getData = res
        this.getArticle(getData.title, getData.plaintext, getData.article, getData.language);
        this.getVocabSheet(getData.vocab_list);
        this.setState({pdfReady: true, loading: false})
      }).catch((err) => {
        console.error(err)
        // this.props.history.push('/error')
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

    toggleEditMode = (e) => {
      this.setState({editMode: !this.state.editMode})
    }

    handleDelete = (e) => {
      console.log("delete this sheet")
      // Do a modal to confirm choice
    }

    render() {
      console.log("SELECTED:", this.state.selected)
      return (
        <Container loading={this.state.loading} title={this.state.title} description="Your generated vocab sheet">
          <Grid
          rows={['xxsmall','fit' ]}
          columns={['1/2', '1/2']}
          gap="small"
          areas={[
            { name: 'menu', start: [0,0], end:[1,0]},
            { name: 'article', start: [0, 1], end: [1, 1] },
            { name: 'vocab', start: [1, 1], end: [1, 1] },
          ]}
        >
            <Box gridArea="menu" alignContent="end" direction="row-reverse">
              <Button data-tip="Delete Sheet" icon={<Trash />} color="black"onClick={this.handleDelete}/>
              <Button data-tip="Edit Sheet" icon={<Edit />} color="black" onClick={this.toggleEditMode}/>
              <Button data-tip="Export to PDF" icon={<Download />} color="black"/>
            </Box>
            <Box gridArea="article">
              <ArticleDisplay 
                article={this.state.article} 
                tokens={this.state.tokens}
                onWordHover={(t) => this.setState({selected: t})}
                offWordHover={(t) => this.setState({selected: null})}/>
            </Box>
            <Box gridArea="vocab" background="light-2">
              <EditMenu editMode={this.state.editMode} toggle={this.toggleEditMode}/>
              <VocabDisplay 
                vocabRows={this.state.vocabRows} 
                selected={this.state.selected}
                editMode={this.state.editMode}
                />
            </Box>
          </Grid>
          <ReactTooltip />
          {/* {this.state.pdfReady ? <PDFViewer>
            <PDFSheet title={this.state.title} tokens={this.state.tokens}/>
          </PDFViewer> : null} */}
         </Container>
      )
    }
  }

  export default withRouter(Sheet);


