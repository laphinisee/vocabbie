import React from "react";
import {Form, FormField, Tabs, Tab, Box, Button, TextArea} from 'grommet';
import { withRouter } from "react-router";

class ArticleUpload extends React.Component {

  constructor(props) {
    super(props) 
    this.state = {
      values: {
          plainText: '',
          url: '',
          file: '',
          title: '',
      },
      errors: {
          plaintText: '',
          url: '',
          file: '',
          title: '',
      },
      touched: {
          plainText: false,
          url: false,
          file: false,
          title: false,
      }
    }
  }

  handleUserFileInput = (e) => {
    const fieldName = e.target.name
    const fieldValue = e.target.files[0]
    this.setState(prevState => ({
      values: {
          ...prevState.values,
          [fieldName]: fieldValue,
      }
    }), this.validateInputs)
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
  const URL_ERROR = 'Please enter a non-empty URL.'

  this.setState(prevState => ({
      ...prevState,
      errors: {
          title: (prevState.values.title.length < 1) ? TITLE_ERROR : '',
          url: (prevState.values.url.length < 1) ? URL_ERROR : '',
          plainText: (prevState.values.plainText.length < 1) ? PLAIN_TEXT_ERROR : '',
          file: prevState.errors.file,
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

  isFormValid = (type) => {
    return this.state.errors[type] === '' && this.state.values[type] !== '' && this.state.values.title !== ''
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
            plainText: this.state.values.plainText,
            title: this.state.values.title
          }), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(data => this.props.history.push(`/display/${data.id}`))
    }

    submitUrl = () => {
      fetch('/generate-url', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.props.user.token,
        },
        redirect: "follow", // manual, *follow, error
        body: JSON.stringify({
          url: this.state.values.url,
          title: this.state.values.title
        }), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(data => this.props.history.push(`/display/${data.id}`))
    }

    submitPdf = () => {
      console.log("submit")
      const data = new FormData()
      data.append('title', this.state.values.title)
      data.append('file', this.state.values.file)

      fetch('/generate-pdf', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Authorization": this.props.user.token,
        },
        redirect: "follow", // manual, *follow, error
        body: data, // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(data => this.props.history.push(`/display/${data.id}`))
      .catch(res => console.log(res))
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
                  value={this.state.values.url} 
                  name="url" 
                  type="text" 
                  label="URL"/>
                  <Button disabled={!this.isFormValid('url')} onClick={this.submitUrl} type="submit" fill={true} primary color="accent-1" label="Generate" />
              </Tab>
              <Tab title="File Upload">
                <input 
                    // error={this.state.touched.title && this.state.errors.title} 
                    onChange={this.handleUserFileInput} 
                    // onBlur={this.handleBlur} 
                    name="file" 
                    type="file" 
                    // label="File Upload"
                />
                <Button disabled={!this.isFormValid('file')} onClick={this.submitPdf} type="submit" fill={true} primary color="accent-1" label="Generate" />
              </Tab>
            </Tabs>
          </Form>
      </Box>
      )
    }
  }

  export default withRouter(ArticleUpload);


