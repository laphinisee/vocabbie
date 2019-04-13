import React from "react";
import {Box, Table, TableRow, TableCell} from 'grommet';

class VocabDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    }


    render() {
      return (
        <Box pad="medium">
          <Table>
            {this.props.vocabRows.map( (vocab, i) => (
              <TableRow>
                <TableCell scope="row">
                  {vocab.original}
                </TableCell>
                <TableCell>
                  {vocab.originalDetail}
                </TableCell>
                <TableCell>
                  {vocab.partOfSpeech}
                </TableCell>
                <TableCell>
                  {vocab.translated}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>
      )
    }
  }

  export default VocabDisplay;


