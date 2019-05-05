import React from "react";
import Container from './Container';
import {Form, FormField, Button} from 'grommet';
import AlertBox from './AlertBox';
import { withRouter } from "react-router";

class Settings extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        values: {
            password: '',
        },
        errors: {
            password: '',
        },
        touched: {
            password: false,
        },
        error: '',
        success: '',
        loading: false,
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
    const PASSWORD_ERROR = 'A password is required.' 

    this.setState(prevState => ({
        ...prevState,
        errors: {
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

  onUpdateSettings = () => {
    this.setState({
      loading: true
    }, () => {
      fetch('/api/settings', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.props.user.token,
        },
        redirect: "follow", // manual, *follow, error
        body: JSON.stringify({
          password: this.state.values.password,
        }), // body data type must match "Content-Type" header
      })
    .then(res => {
      if(res.status === 200) {
        this.setState({
          success: 'Your password has been updated.',
        })
      } else {
        this.props.history.push('/error')
      }
    })
    .catch(err => {
      this.props.history.push('/error')
    })})
  }

  render() {
    return (
      <Container title="Settings" description="Manage your account, update preferences, etc.">
        <Form>
          {this.state.error && <AlertBox type="error" message={this.state.error}/>}
          {this.state.success && <AlertBox type="ok" message={this.state.success}/>}

          <FormField error={this.state.touched.password && this.state.errors.password} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.password} name="password" type="password" label="Change your password" />
          <Button disabled={!this.isFormValid() || this.props.loading} onClick={this.onUpdateSettings} type="submit" label={this.props.loading ? 'Loading...' : "Save"} fill={true} primary color="accent-1"/> 
        </Form>
      </Container>
    )
  }
}

  export default withRouter(Settings);