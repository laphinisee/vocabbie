import React from "react";
import ArticleDisplay from './ArticleDisplay';
import Container from './Container';
import VocabDisplay from './VocabDisplay';
import PDFSheet from './PDFSheet'
import ReactTooltip from 'react-tooltip'
import {Button, TextInput, Table, TableBody, TableRow, TableCell, Box} from 'grommet';
import {Download, Trash, Edit, Iteration} from 'grommet-icons'
import {PDFViewer} from '@react-pdf/renderer';
import { withRouter } from "react-router";
import {Container as GridContainer, Row, Col } from 'react-grid-system';

const EditMenu = (props) => {
  if (props.editMode) {
    // Add in text field to add Words
    return (
    <Box pad="medium" background="light-4">
      <Table size="fit">
        <TableBody>
        <TableRow>
          <TableCell scope="col">
            <TextInput name="newWord" size="small" value={props.newWord} onChange={props.handleWordInput} placeholder="Word" />
          </TableCell>
          <TableCell scope="col">
            <TextInput name="newPOS" size="small" value={props.newPOS} onChange={props.handleWordInput} placeholder="Part of Speech" />
          </TableCell>
          <TableCell scope="col">
            <TextInput name="newTranslation" size="small" value={props.newTranslation} onChange={props.handleWordInput} placeholder="Translation" />
          </TableCell>
          <TableCell scope="col">
          </TableCell>
        </TableRow>
        </TableBody>
      </Table>
      <br/>
      <Button onClick={props.addWord} type="submit" fill={true} primary color="accent-1" label="Add Word" />
      <Button label="Finish editing" onClick={props.toggle} />
    </Box>)
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
      values: {
        newWord: '',
        newPOS: '',
        newTranslation: '',
        title: '',
      },
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
        console.log("DATA:", getData)
        this.getArticle(getData.title, getData.plaintext, getData.article, getData.language);
        this.getVocabSheet(getData.vocab_list);
        this.setState({pdfReady: true, loading: false})
      }).catch((err) => {
        console.error(err)
        this.props.history.push('/error')
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

    addWord = (e) => {
      // console.log(this.props.match.params.id)
      const word = {lemma: this.state.values.newWord}
      if (this.state.editMode) {
        const url = '/document/' + this.props.match.params.id + '/add'
        fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.props.user.token,
          },
          body: JSON.stringify({word}), // body data type must match "Content-Type" header
        }).then( (res) => res.json()).then((res) => {
          console.log(res)
          this.setState({vocabRow: res})
        // TODO: Would be nice to get in response new vocab_list.
        }).catch((err) => {
          console.error(err)
          // this.props.history.push('/error')
        })
      }
    }

    handleWordInput = (e) => {
      const fieldName = e.target.name
      const fieldValue = e.target.value
      this.setState(prevState => ({
        values: {
            ...prevState.values,
            [fieldName]: fieldValue,
        }
      }))
    }

    handleDelete = (e) => {
      console.log("delete this sheet")
      console.log(this.props.match.params.id)
      // Do a modal to confirm choice
    }

    render() {
      const docId = this.props.match.params.id
      return (
        <Container loading={this.state.loading} title={this.state.title} description="Your generated vocab sheet">
          <GridContainer>
            <Row>
              <Col offset={{sm:9}} sm={3}>
                <Box gridArea="menu" alignContent="end" direction="row-reverse">
                  <Button data-tip="Delete Sheet" icon={<Trash />} color="black"onClick={this.handleDelete}/>
                  <Button data-tip="Edit Sheet" icon={<Edit />} color="black" onClick={this.toggleEditMode}/>
                  <Button data-tip="View as Flashcards" icon={<Iteration />} color="black" href={`/flashcards/${this.props.match.params.id}`}/>
                  <Button data-tip="Export to PDF" icon={<Download />} color="black"/>
                </Box>
              </Col>
            </Row>
            <Row>
            < Col sm={12} push={{ md: 6 }} md={6}>
              <Box gridArea="vocab" background="light-2">
                <EditMenu 
                  addWord={this.addWord}
                  newWord={this.state.newWord} 
                  newPOS={this.state.newPOS} 
                  newTranslation={this.state.newTranslation} 
                  handleWordInput={this.handleWordInput} 
                  editMode={this.state.editMode} 
                  toggle={this.toggleEditMode}/>
                <VocabDisplay 
                  vocabRows={this.state.vocabRows} 
                  selected={this.state.selected}
                  editMode={this.state.editMode}
                  docId={docId}
                  user={this.props.user}
                  />
              </Box>
            </ Col>
              <Col sm={12} pull={{ md: 6 }} md={6}>
                <Box gridArea="article">
                  <ArticleDisplay 
                    article={this.state.article} 
                    tokens={this.state.tokens}
                    onWordHover={(t) => this.setState({selected: t})}
                    offWordHover={(t) => this.setState({selected: null})}/>
                </Box>
              </ Col>
            </Row>
          </GridContainer>
          <ReactTooltip />
          {/* {this.state.pdfReady ? <PDFViewer>
            <PDFSheet title={this.state.title} tokens={this.state.tokens}/>
          </PDFViewer> : null} */}
         </Container>
      )
    }
  }

  export default withRouter(Sheet);


