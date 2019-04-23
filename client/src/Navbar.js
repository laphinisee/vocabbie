import React from "react";
import { Box, Image, Anchor, ResponsiveContext, Menu, Text} from 'grommet';
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
    <Box><Anchor color="neutral-2" href="/sheets" primary label="My Articles" /></Box>
    <Box><Anchor color="neutral-2" href="/create" primary label="Upload" /></Box>
  </Box>
)

const CollapsedMenu = (props) => (
  <Box direction="row" gap="medium">
    <Menu
      size='small'
      label={<Text size='small' weight='bold' color="neutral-2" href="/articles" primary>Menu</Text>}
      color="neutral-2"
      items={[
        { label: <Text size='small' weight='bold' color="neutral-2" href="/articles" primary>My Articles</Text>, href:'/articles' },
        { label: <Text size='small' weight='bold' color="neutral-2" href="/articles" primary>Upload</Text>, href:'/create' },
      ]}
    />
  </Box>
)

class UserMenu extends React.Component {

  render() {
    console.log("props:", this.props.loggedIn)
    if(this.props.loggedIn) {
      return (
        <Box direction="row" gap="medium">
          <Box><Anchor color="neutral-2" href="/settings" primary label="Hi Name" /></Box>
          <Box><Anchor color="neutral-2" onClick={this.props.onLogout} primary label="Logout" /></Box>
        </Box>
      )
    } else {
      return (
        <Box direction="row" gap="medium">
          <Box><Anchor color="neutral-2" href="/login" primary label="Login" /></Box>
          <Box><Anchor color="neutral-2" onClick={(e) => alert("signup!")} primary label="Signup" /></Box>
        </Box>
      )
    }
  }
}

class Navbar extends React.Component {
    render() {
      return (
        <Bar >
            <ResponsiveContext.Consumer>
              {size => size === 'small' ? <CollapsedMenu/> : <MenuBar/>}
            </ResponsiveContext.Consumer>
            <a href="/"><Image width={150} src={logo} alt="Vocabbie" /></a>
            <UserMenu loggedIn={this.props.loggedIn} onLogout={this.props.onLogout}/>
        </Bar>
      )
    }
  }

  export default Navbar;