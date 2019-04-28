import React from "react";
import { Box, Image, Anchor, ResponsiveContext, Menu, Text} from 'grommet';
import logo from './images/logo-blue.png';
import { withRouter } from "react-router";

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
      label={<Text size='small' weight='bold' color="neutral-2" href="/sheets" primary>Menu</Text>}
      color="neutral-2"
      items={[
        { label: <Text size='small' weight='bold' color="neutral-2" href="/sheets" primary>My Articles</Text>, href:'/articles' },
        { label: <Text size='small' weight='bold' color="neutral-2" href="/create" primary>Upload</Text>, href:'/create' },
      ]}
    />
  </Box>
)

class UserMenu extends React.Component {

  onLogout = () => {
    this.props.onLogout()
    this.props.history.push('/');
  }

  render() {
    console.log("props:", this.props.loggedIn)
    if(this.props.loggedIn) {
      return (
        <Box direction="row" gap="medium">
          <Box><Anchor color="neutral-2" href="/settings" primary label={`Hi, ${this.props.user.name}`} /></Box>
          <Box><Anchor color="neutral-2" onClick={this.onLogout} primary label="Logout" /></Box>
        </Box>
      )
    } else {
      return (
        <Box direction="row" gap="medium">
          <Box><Anchor color="neutral-2" href="/login" primary label="Login" /></Box>
          <Box><Anchor color="neutral-2" onClick={() => this.props.history.push('/signup')} primary label="Signup" /></Box>
        </Box>
      )
    }
  }
}

class Navbar extends React.Component {
    render() {
      return (
        <Bar >
            {this.props.loggedIn ? <ResponsiveContext.Consumer>
              {size => size === 'small' ? <CollapsedMenu/> : <MenuBar/>}
            </ResponsiveContext.Consumer> : <Box margin="medium"/>
            }
            
            <a href={this.props.loggedIn ? '/sheets' : '/'}><Image width={150} src={logo} alt="Vocabbie" /></a>
            <UserMenu loggedIn={this.props.loggedIn} user={this.props.user} onLogout={this.props.onLogout} history={this.props.history}/>
        </Bar>
      )
    }
  }

  export default withRouter(Navbar);