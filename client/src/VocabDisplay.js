import React from "react";
import {Box, Table, TableRow, TableCell, TableBody, TableHeader} from 'grommet';

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    }

    render() {
      return (
        <Box pad="medium">
          <Table>
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
            </TableRow>
          </TableHeader>
            <TableBody>
              {Object.keys(this.props.vocabRows).map( (k) => {
                const vocab = this.props.vocabRows[k]
                // console.log("VocabDisplay:", k, vocab)
                return (
                  <TableRow>
                    <TableCell scope="row" border="bottom">
                      <strong>{vocab.text}</strong>
                    </TableCell>
                    <TableCell border="bottom">
                      {vocab.pos}
                    </TableCell>
                    <TableCell border="bottom">
                      {vocab.translation}
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


