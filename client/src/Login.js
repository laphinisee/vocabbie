import React from "react";
import Container from './Container';
import {Form, FormField, Button} from 'grommet';

class Login extends React.Component {

    render() {
      return (
        <Container title="Login" description="Login!">
            <Form>
                <FormField name="email" type="email" label="Email" />
                <FormField name="password" type="password" label="Password" />
                <Button type="submit" primary label="Login" />
            </Form>
        </Container>
      )
    }
  }

  export default Login;