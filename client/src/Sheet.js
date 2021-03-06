import React from "react";
import ArticleDisplay from './ArticleDisplay';
import Container from './Container';
import VocabDisplay from './VocabDisplay';
import ReactTooltip from 'react-tooltip'
import {Button, TextInput, Table, TableBody, TableRow, TableCell, Box} from 'grommet';
import {Download, Trash, Edit, Iteration} from 'grommet-icons'
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
            <TextInput name="newWord" value={props.newWord} onChange={props.handleWordInput} placeholder="Word" />
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
      const url = '/api/document/' + this.props.match.params.id
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
    }

    getVocabSheet(vocabRows) {
      this.setState({vocabRows})
    }

    toggleEditMode = (e) => {
      this.setState({editMode: !this.state.editMode})
    }

    addWord = (e) => {
      const word = this.state.values.newWord
      if (this.state.editMode) {
        const url = '/api/document/' + this.props.match.params.id + '/add'
        fetch(url, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.props.user.token,
          },
          body: JSON.stringify({word}), // body data type must match "Content-Type" header
        }).then( (res) => res.json()).then((res) => {
          this.setState({vocabRows: res})
        }).catch((err) => {
          console.error(err)
          this.props.history.push('/error')
        })
      }
    }

  removeVocab = (word) => (e) => {
    if (this.state.editMode) {
      const url = '/api/document/' + this.props.match.params.id + '/delete'
      fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.props.user.token,
        },
        body: JSON.stringify({word}),
      }).then( (res) => res.json()).then((res) => {
        this.setState({vocabRows: res})
      }).catch((err) => {
        this.props.history.push('/error')
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
      const url = '/api/sheet/' + this.props.match.params.id + '/delete'
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.props.user.token,
        },
      }).then(() => {
        this.props.history.push('/sheets')
      })
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
                  <Button disabled={!this.state.pdfReady} data-tip="Export to PDF" icon={<Download />} color="black" onClick={() => {
                    this.props.history.push({
                      pathname:"/pdf",
                      state:{
                          title: this.state.title, 
                          vocabRows: this.state.vocabRows
                       }
                     });         
                  }}/>
                </Box>
              </Col>
            </Row>
            <Row>
            <Col sm={12} push={{ md: 6 }} md={6}>
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
                  removeVocab={this.removeVocab}
                  docId={docId}
                  user={this.props.user}
                  />
              </Box>
            </Col>
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
         </Container>
      )
    }
  }

  export default withRouter(Sheet);


