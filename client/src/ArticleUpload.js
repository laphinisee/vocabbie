import React from "react";
import {Form, FormField, Tabs, Tab, Box, Button, Select, TextArea} from 'grommet';

class ArticleUpload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      values: {
          plainText: '',
          title: '',
          language: '',
      },
      errors: {
          plaintText: '',
          title: '',
          language: ''
      },
      touched: {
          plainText: false,
          title: false,
          langage: false
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
          redirect: "follow", // manual, *follow, error
          body: {
            text: this.state.plainText,
            title: this.state.values.title
          }, // body data type must match "Content-Type" header
      })
    }

    submitUrl() {
      console.log("submitting url...")
    }

    submitPdf() {
      console.log("submit pdf")
    }

    setLanguage(l) {
      this.setState(prevState => ({
        values: {
          ...prevState.values,
          language: l}
      }))
    }

    render() {
      return (
        <Box pad="medium">
          <Select alignSelf="end"
                  onChange={({option}) => this.setLanguage(option)} 
                  value={this.state.values.language || "Choose your language"} 
                  labelKey={(opt) => opt.label} 
                  valueKey={(opt) => opt.value} 
                  options={[ {value: "fr", label:"French"},  {value: "sp", label:"Spanish"}]}/>
          <Tabs margin="medium">
            <Tab title="Plain Text">
              <Box pad="medium">
              <Form>
                <FormField error={this.state.touched.title && this.state.errors.title} onChange={this.handleUserInput} onBlur={this.handleBlur} value={this.state.values.title} name="title" type="text" label="Title" />
                <TextArea 
                  name='plainText' 
                  error={this.state.touched.plainText && this.state.errors.plainText} 
                  onChange={this.handleUserInput} 
                  onBlur={this.handleBlur} 
                  value={this.state.values.plainText} 
                  placeholder="Type your article here" />
                <Button disabled={!this.isFormValid()} onClick={this.submitPlainText} type="submit" fill={true} primary color="accent-1" label="Generate" />
              </Form>
              </Box>
            </Tab>
          </Tabs>
      </Box>
      )
    }
  }

  export default ArticleUpload;


