import React from "react";
import { Box, Image, Anchor, ResponsiveContext, Menu} from 'grommet';
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

const MenuBar = (props) => (
  <Box direction="row" gap="medium">
    <Box><Anchor color="neutral-2" href="/articles" primary label="My Articles" /></Box>
    <Box><Anchor color="neutral-2" href="/create" primary label="Upload" /></Box>
  </Box>
)

const CollapsedMenu = (props) => (
  <Box direction="row" gap="medium">
    <Menu
      style={
        {
          'text-size': 8,
        }
      }
      label="Menu"
      color="neutral-2"
      items={[
        { label: 'My Articles', onClick: () => {} },
        { label: 'Upload', onClick: () => {} },
      ]}
    />
  </Box>
)

class Navbar extends React.Component {
    render() {
      return (
        <Bar >
            <ResponsiveContext.Consumer>
              {size => size == 'small' ? <CollapsedMenu/> : <MenuBar/>}
            </ResponsiveContext.Consumer>
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