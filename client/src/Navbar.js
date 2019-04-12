import React from "react";
import { Box, Grommet } from 'grommet';

class Navbar extends React.Component {
    render() {
      return (
        <Box direction="row" pad={{ between: 'medium' }}>
          <Box pad="small" colorIndex="neutral-1">A</Box>
          <Box pad="small" colorIndex="neutral-2">B</Box>
          <Box pad="small" colorIndex="neutral-3">C</Box>
      </Box>
      )
    }
  }

  export default Navbar;