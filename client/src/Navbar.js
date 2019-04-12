import React from "react";
import { Box, Heading, Button } from 'grommet';
import { Notification } from 'grommet-icons';

const Bar = (props) => (
  <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
      background='neutral-2'
      pad={{ left: 'medium', right: 'medium', vertical: 'small' }}
      style={{ zIndex: '1' }}
      {...props}
    />
)

class Navbar extends React.Component {
    render() {
      return (
        <Bar>
           <Heading level='3' margin='none'>My App</Heading>
            {/* Put more navigation bar items here... */}
        </Bar>
      )
    }
  }

  export default Navbar;