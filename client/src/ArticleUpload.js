import React from "react";
import {Form, FormField, Tabs, Tab, Box, Button, TextArea} from 'grommet';
import { withRouter } from "react-router";

class ArticleUpload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      values: {
          plainText: '',
          title: '',
      },
      errors: {
          plaintText: '',
          title: '',
      },
      touched: {
          plainText: false,
          title: false,
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
  const TITLE_ERROR = 'Please enter non-empty title.'

  this.setState(prevState => ({
      ...prevState,
      errors: {
          title: (prevState.values.title.length < 1) ? TITLE_ERROR : '',
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
      fetch('/generate-text', {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.props.user.token,
          },
          redirect: "follow", // manual, *follow, error
          body: JSON.stringify({
            text: this.state.values.plainText,
            title: this.state.values.title
          }), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(data => this.props.history.push(`/display/${data.id}`))
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
          <Form>
            <Box gridArea="title" alignContent="start">
                  <FormField 
                            error={this.state.touched.title && this.state.errors.title} 
                            onChange={this.handleUserInput} 
                            onBlur={this.handleBlur} 
                            value={this.state.values.title} 
                            name="title" 
                            type="text" 
                            label="Title"/>
              </Box>
            <Tabs margin="medium">
              <Tab title="Plain Text">
                <Box pad="medium">
                  <TextArea 
                    name='plainText' 
                    error={this.state.touched.plainText && this.state.errors.plainText} 
                    onChange={this.handleUserInput} 
                    onBlur={this.handleBlur} 
                    value={this.state.values.plainText} 
                    placeholder="Type your article here" /><br/>
                  <Button disabled={!this.isFormValid('plainText')} onClick={this.submitPlainText} type="submit" fill={true} primary color="accent-1" label="Generate" />
                </Box>
              </Tab>
              <Tab title="URL">
                <FormField 
                  error={this.state.touched.title && this.state.errors.title} 
                  onChange={this.handleUserInput} 
                  onBlur={this.handleBlur} 
                  value={this.state.values.title} 
                  name="url" 
                  type="text" 
                  label="URL"/>
                  <Button disabled={!this.isFormValid('url')} onClick={this.submitUrl} type="submit" fill={true} primary color="accent-1" label="Generate" />
              </Tab>
              <Tab title="File Upload">
              <FormField 
                  error={this.state.touched.title && this.state.errors.title} 
                  onChange={this.handleUserInput} 
                  onBlur={this.handleBlur} 
                  value={this.state.values.title} 
                  name="file" 
                  type="file" 
                  label="File Upload"/>
                  <Button disabled={!this.isFormValid('file')} onClick={this.submitFIle} type="submit" fill={true} primary color="accent-1" label="Generate" />
              </Tab>
            </Tabs>
          </Form>
      </Box>
      )
    }
  }

  export default withRouter(ArticleUpload);


