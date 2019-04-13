import React from "react";
import Container from './Container';
import {Form, FormField, Button} from 'grommet';

class Signup extends React.Component {

    render() {
      return (
        <Container title="Signup" description="Signup!">
            <Form>
                <FormField name="name" type="name" label="Name" />
                <FormField name="email" type="email" label="Email" />
                <FormField name="password" type="password" label="Password" />
                <Button type="submit" primary label="Signup" />
            </Form>
        </Container>
      )
    }
  }

  export default Signup;