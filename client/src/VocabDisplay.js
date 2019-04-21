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
            {Object.keys(this.props.vocabRows).map( (k) => {
              const vocab = this.props.vocabRows[k]
              console.log(vocab)
              return (
                <TableRow>
                  <TableCell scope="row" border="bottom">
                    {vocab.str}
                  </TableCell>
                  <TableCell border="bottom">
                    {vocab.pos}
                  </TableCell>
                  <TableCell border="bottom">
                    {vocab.translated}
                  </TableCell>
                </TableRow>
              )
            })}
          </Table>
        </Box>
      )
    }
  }

  export default VocabDisplay;


