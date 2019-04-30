import React from "react";
import Container from './Container';
import {Form, FormField, Anchor, Box, Button} from 'grommet';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import AlertBox from './AlertBox'

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
        },
        error: '',
        loading: false,
        redirect: localStorage.getItem('JWT') !== null
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
    this.setState({
      loading: true
    }, () => {
    axios.post('/login', {
      email: this.state.values.email,
      password: this.state.values.password,
    })
    .then(res => {
      if(res.data.error) {
        this.setState({
          error: true,
          loading: false,
        })
      } else {
        localStorage.setItem('JWT', res.data.token);        
        this.props.onLogin(res.data.token)
        this.setState({
          redirect: true,
        })
      }
    })
    .catch(err => {
      this.setState({
        loading: false,
        error: true,
      })
    })})
  }

  render() {
    return (
      <Container title="Login" description="Login!">
          {this.state.redirect && <Redirect to='/' />}
          <Form>
            {this.state.error && <AlertBox type="error" message="Oh no! Your email or password was incorrect."/>}
            <FormField error={this.state.touched.email && this.state.errors.email} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.email} name="email" type="email" label="Email" />
            <FormField error={this.state.touched.password && this.state.errors.password} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.password} name="password" type="password" label="Password" />
            <Button disabled={!this.isFormValid() || this.props.loading} onClick={this.onLogin} type="submit" label={this.props.loading ? 'Loading...' : "Login"} fill={true} primary color="accent-1"/> 
          </Form>
          <Box align="center" margin="medium">
              <Anchor href="/signup" color="accent-1">Create an account</Anchor>
          </Box>
      </Container>
    )
  }
}

  export default Login;