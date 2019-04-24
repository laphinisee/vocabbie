import React from "react";
import Container from './Container';

class Settings extends React.Component {

  render() {
    console.log("SETTINGS:", this.props)
    return (
      <Container title="Settings" description="Manage your account, update preferences, etc.">

      </Container>
    )
  }
}

  export default Settings;