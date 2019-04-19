import React from "react";
import Container from './Container';
import {Form, FormField, Anchor, Box, Button} from 'grommet';

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        values: {
            email: '',
            password: '',
        },
        errors: {
            email: '',
            password: '',
        },
        touched: {
            email: false,
            password: false,
        }
    }
  }

  handleUserInput = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value
    this.setState(prevState => ({
        values: {
            ...prevState.values,
            [fieldName]: fieldValue,
        }
    }), this.validateInputs)
  }

  validateInputs = () => {
    const EMAIL_ERROR = 'A valid email address is required.'
    const PASSWORD_ERROR = 'A password is required.' 

    this.setState(prevState => ({
        ...prevState,
        errors: {
            email: (prevState.values.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? '' : EMAIL_ERROR),
            password: (prevState.values.password.length < 1) ? PASSWORD_ERROR : '',
        }
    }))
  }

  handleBlur = (e) => {
      const fieldName = e.target.name
      this.setState(prevState => ({
          touched: {
              ...prevState.touched,
              [fieldName]: true
          }
      }))
  }

  isFormValid = () => {
      return Object.values(this.state.errors).every(e => e === '') &&
            Object.values(this.state.values).every(e => e !== '')
  }

  onLogin = () => {
      console.log(this.state.values)
  }
  render() {
    return (
      <Container title="Login" description="Login!">
          <Form>
            <FormField error={this.state.touched.email && this.state.errors.email} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.email} name="email" type="email" label="Email" />
            <FormField error={this.state.touched.password && this.state.errors.password} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.password} name="password" type="password" label="Password" />
            <Button disabled={!this.isFormValid()} onClick={this.onLogin} type="submit" label="Login" fill="true" primary color="accent-1"/> 
          </Form>
          <Box align="center" margin="medium">
              <Anchor href="/signup" color="accent-1">Create an account</Anchor>
          </Box>
      </Container>
    )
  }
}

  export default Login;