import React from "react";
import Container from './Container';
import {Button} from 'grommet';

class Error extends React.Component {

  render() {
    console.log("Error:", this.props)
    return (
      <Container title="Error" description="Oops!">
        We're currently experiencing some issues with our server. Check back soon!
        <Button label="Take me back home!" href="/" alignSelf="start"/>
      </Container>
    )
  }
}

  export default Error;