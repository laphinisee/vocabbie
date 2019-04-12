import React from "react";
import { Box, Heading, Button, Image } from 'grommet';
import { Notification } from 'grommet-icons';
import logo from './images/logo-dark.png';


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
        <Bar justify='center'>
            <Image width={150} src={logo} alt="Vocabbie" />
        </Bar>
      )
    }
  }

  export default Navbar;