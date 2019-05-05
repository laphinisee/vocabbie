import React from "react";
import {Box, Button, Table, TableRow, TableCell, TableBody, TableHeader} from 'grommet';
import {FormClose} from 'grommet-icons'
import './App.css';

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vocabRows: this.props.vocabRows
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.vocabRows.length === 0) {
      return {vocabRows: props.vocabRows};
    } 
  }
  
  removeVocab = (word) => (e) => {
    if (this.props.editMode) {
      const url = '/document/' + this.props.docId + '/delete'
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
              <TableCell className={!this.props.editMode ? "hide" : ""}  scope="col" border="bottom">
              </TableCell>
            </TableRow>
          </TableHeader>
            <TableBody>
              {Object.keys(this.state.vocabRows).map( (k) => {
                const vocab = this.state.vocabRows[k]
                return (
                  <TableRow className="vocabRow" key={k} style={parseInt(k) === this.props.selected ? {backgroundColor: "#ffffff"} : {}}>
                    <TableCell scope="row" border="bottom">
                      <strong>{vocab.text}</strong>
                    </TableCell>
                    <TableCell scope="row" border="bottom">
                      {vocab.pos}
                    </TableCell>
                    <TableCell scope="row" border="bottom">
                      {vocab.translation}
                    </TableCell>
                    <TableCell className={(!this.props.editMode ? "hide" : "") + " manualPadding"} scope="row" border="bottom">
                      <Button disabled={!this.props.editMode} icon={<FormClose/>} margin="xsmall" size="xxsmall" plain={true} focusIndicator={false} onClick={this.removeVocab(vocab.str)}/>
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


