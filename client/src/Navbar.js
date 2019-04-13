import React from "react";
import { Box, Image, Anchor, Grid } from 'grommet';
import logo from './images/logo-dark.png';


const Bar = (props) => (
  <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
      background='neutral-2'
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
              <Box><Anchor color="white" href="/articles" primary label="My Articles" /></Box>
              <Box><Anchor color="white" href="/create" primary label="Upload" /></Box>
            </Box>
            <a href="/"><Image width={150} src={logo} alt="Vocabbie" /></a>
            <Box direction="row" gap="medium">
              <Box><Anchor color="white" href="/login" primary label="Login" /></Box>
              <Box><Anchor color="white" href="/signup" primary label="Signup" /></Box>
            </Box>
        </Bar>
      )
    }
  }

  export default Navbar;