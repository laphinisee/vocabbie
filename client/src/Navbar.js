import React from "react";
import { Box, Image, Anchor } from 'grommet';
import logo from './images/logo-blue.png';


const Bar = (props) => (
  <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
      background='white'
      pad={{ left: 'xlarge', right: 'xlarge', vertical: 'small' }}
      style={{ zIndex: '1' }}
      {...props}
    />
)

class Navbar extends React.Component {
    render() {
      return (
        <Bar >
            <Box direction="row" gap="medium">
              <Box><Anchor color="neutral-2" href="/articles" primary label="My Articles" /></Box>
              <Box><Anchor color="neutral-2" href="/create" primary label="Upload" /></Box>
            </Box>
            <a href="/"><Image width={150} src={logo} alt="Vocabbie" /></a>
            <Box direction="row" gap="medium">
              <Box><Anchor color="neutral-2" href="/login" primary label="Login" /></Box>
              <Box><Anchor color="neutral-2" href="/signup" primary label="Signup" /></Box>
            </Box>
        </Bar>
      )
    }
  }

  export default Navbar;