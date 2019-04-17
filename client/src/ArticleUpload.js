import React from "react";
import {Form, Tabs, Tab, Box, Button, TextArea, } from 'grommet';

class ArticleUpload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      values: {
          plainText: '',
      },
      errors: {
          plaintText: '',
      },
      touched: {
          plainText: false
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
  const PLAIN_TEXT_ERROR = 'Please enter non-empty article.'

  this.setState(prevState => ({
      ...prevState,
      errors: {
          plainText: (prevState.values.plainText.length < 1) ? PLAIN_TEXT_ERROR : '',
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

  submitPlainText = (e) => {
        fetch('/generate', {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          redirect: "follow", // manual, *follow, error
          body: {
            text: this.state.plainText
          }, // body data type must match "Content-Type" header
      })
    }

    submitUrl() {
      console.log("submitting url...")
    }

    submitPdf() {
      console.log("submit pdf")
    }

    render() {
      return (
        <Box pad="medium">
          <Tabs>
            <Tab title="Plain Text">
              <Box pad="medium">
              <Form>
                <TextArea 
                  name='plainText' 
                  error={this.state.touched.plainText && this.state.errors.plainText} 
                  onChange={this.handleUserInput} 
                  onBlur={this.handleBlur} 
                  value={this.state.values.plainText} 
                  placeholder="Type your article here" />
                <Button disabled={!this.isFormValid()} onClick={this.submitPlainText} type="submit" primary label="Submit" />
              </Form>
              </Box>
            </Tab>
          </Tabs>
        <Button label="Detect Language" />
      </Box>
      )
    }
  }

  export default ArticleUpload;


