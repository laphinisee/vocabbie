import React from "react";
import {Box, Button, Table, TableRow, TableCell, TableBody, TableHeader} from 'grommet';
import {FormClose} from 'grommet-icons'

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vocabRows: this.props.vocabRows
    };
    }
  
  removeVocab = (word) => (e) => {
    // const url = '/document/' + this.props.match.params.id
    console.log(this.props.docId)
    console.log(word)
    // this.setState({vocabRows: []})
    // fetch(url, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": this.props.user.token,
    //   },
    // }).then( (res) => res.json()).then((res) => {
    //   const getData = res
    //   this.getArticle(getData.title, getData.plaintext, getData.article, getData.language);
    //   this.getVocabSheet(getData.vocab_list);
    //   this.setState({pdfReady: true, loading: false})
    // TODO: Would be nice to get in response new vocab_list.
    // }).catch((err) => {
    //   console.error(err)
    //   // this.props.history.push('/error')
    // })
  }

    render() {
      return (
        <Box pad="medium" size="fit">
          <Table size="fit">
          <TableHeader>
            <TableRow>
              <TableCell scope="col" border="bottom">
                Word
              </TableCell>
              <TableCell scope="col" border="bottom">
                Part of Speech
              </TableCell>
              <TableCell scope="col" border="bottom">
                Translation
              </TableCell>
              <TableCell scope="col" border="bottom">
              </TableCell>
            </TableRow>
          </TableHeader>
            <TableBody>
              {Object.keys(this.state.vocabRows).map( (k) => {
                const vocab = this.state.vocabRows[k]
                return (
                  <TableRow style={k == this.props.selected ? {backgroundColor: "#ffffff"} : {}}>
                    <TableCell scope="row" border="bottom">
                      <strong>{vocab.text}</strong>
                    </TableCell>
                    <TableCell scope="row" border="bottom">
                      {vocab.pos}
                    </TableCell>
                    <TableCell scope="row" border="bottom">
                      {vocab.translation}
                    </TableCell>
                    <TableCell scope="row" border="bottom">
                      <Button disabled={!this.props.editMode} icon={<FormClose/>} margin="xsmall" size="xsmall" plain={true} focusIndicator={false} onClick={this.removeVocab(vocab.text)}/>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )
    }
  }

  export default VocabDisplay;


