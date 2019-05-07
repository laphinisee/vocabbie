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
    return state;
  }

    render() {
      return (
        <Box pad="medium" size="fit">
          <Table size="fit">
          <TableHeader>
            <TableRow className="vocabHeader">
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
              {Object.keys(this.props.vocabRows).map((k) => {
                const vocab = this.props.vocabRows[k]
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
                      <Button disabled={!this.props.editMode} icon={<FormClose/>} margin="xsmall" size="xxsmall" plain={true} focusIndicator={false} onClick={this.props.removeVocab(vocab.str)}/>
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


