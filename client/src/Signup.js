import React from "react";
import Container from './Container';
import {Anchor, Box, Form, FormField, Button, Heading, Paragraph, Text} from 'grommet';
import TypeOut from 'react-typeout';
import {Container as GridContainer, Row, Col, Hidden } from 'react-grid-system';
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import AlertBox from './AlertBox'
import { withRouter } from "react-router";

class Signup extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                name: '',
                email: '',
                password: '',
            },
            errors: {
                name: '',
                email: '',
                password: '',
            },
            touched: {
                name: false,
                email: false,
                password: false,
            },
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
        const NAME_ERROR = 'A name is required.'
        const EMAIL_ERROR = 'A valid email address is required.'
        const PASSWORD_ERROR = 'Password must be at least 8 characters.' 

        this.setState(prevState => ({
            ...prevState,
            errors: {
                name: (prevState.values.name.length < 1) ? NAME_ERROR : '',
                email: (prevState.values.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? '' : EMAIL_ERROR),
                password: (prevState.values.password.length < 8) ? PASSWORD_ERROR : '',
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

    onSignup = () => {
        axios.post('/register', {
            email: this.state.values.email,
            name: this.state.values.name,
            password: this.state.values.password,
          })
          .then(res => {
            if(res.data.error) {
              this.setState({
                error: res.data.error,
              })
            } else {
              localStorage.setItem('JWT', res.data.token);     
              this.props.onLogin(res.data.token)
              this.props.history.push(`/`)
            }
          })
    }

    render() {
      const words = ['Let\'s learn.', 'Aprendamos.', '我们来学习', 'Lass uns lernen']
      return (
        <Container title="Sign Up" description="Let's begin your journey with a new language.">
        {this.state.redirect && <Redirect to='/sheets' />}
        <GridContainer>
            <Row>
                <Hidden xs sm>
                    <Col md={6}>
                        <Heading textAlign='start' color='neutral-2' level={1}>
                            <TypeOut caret words={words} />
                        </Heading>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing 
                            elit. Praesent sed metus feugiat, bibendum arcu sit amet, 
                            ultricies tellus. Nulla ac consequat eros. Nunc placerat 
                            elementum iaculis. Ut auctor congue mauris, a lacinia leo 
                            maximus id. Vivamus eleifend orci quis imperdiet convallis. 
                            Nam volutpat eget lorem et elementum. Sed condimentum 
                            rhoncus mi, eget vulputate lorem luctus quis.</Paragraph>
                    </Col>
                </Hidden>
                <Col sm={12} md={6}>
                    <br/>
                    <Text alignSelf="center">
                        To get started, simply make an account or sign up using Facebook or Google.<br/><br/>
                    </Text>
                    <Form>
                        {this.state.error && <AlertBox type="error" message={this.state.error}/>}
                        <FormField error={this.state.touched.name && this.state.errors.name} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.name} name="name" type="text" label="Full Name" />
                        <FormField error={this.state.touched.email && this.state.errors.email} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.email} name="email" type="email" label="Email Address" />
                        <FormField error={this.state.touched.password && this.state.errors.password} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.password} name="password" type="password" label="Password" />
                        <Button disabled={!this.isFormValid()} onClick={this.onSignup} type="submit" label="Sign Up" fill={true} primary color="accent-1"/> 
                    </Form>
                    <Box align="center" margin="medium">
                        <Anchor href="/login" color="accent-1">Already have an account?</Anchor>
                    </Box>
                </Col>
            </Row>
        </GridContainer>
        </Container>
      )
    }
  }

  export default withRouter(Signup);