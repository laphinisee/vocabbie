import React from "react";
import {Form, FormField, Grid, Tabs, Tab, Box, Button, Select, TextArea} from 'grommet';

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
          headers: {"Content-Type": "application/json"},
          redirect: "follow", // manual, *follow, error
          body: JSON.stringify({
            text: this.state.values.plainText,
            title: this.state.values.title
          }), // body data type must match "Content-Type" header
      }, (res) => {
        console.log(res)
      })
    }

    submitUrl() {
      console.log("submitting url...")
    }

    submitPdf() {
      console.log("submit pdf")
    }

    setLanguage(l) {
      console.log(l)
      this.setState(prevState => ({
        values: {
          ...prevState.values,
          language: l}
      }))
    }

    render() {
      return (
        <Box pad="medium">
          <Form>
            <Grid
            rows={['fit']}
            columns={['3/4', '1/4']}
            gap="small"
            areas={[
              { name: 'title', start: [0,0], end:[1,0]},
              { name: 'lang', start: [1, 0], end: [1, 0] },
            ]}
            >
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
              <Box gridArea="lang" alignContent="end" alignSelf="center">
              <Select onChange={({option}) => this.setLanguage(option)} 
                      value={this.state.values.language || "Choose your language"} 
                      labelKey={(opt) => opt.label} 
                      valueKey={(opt) => opt.value} 
                      options={[ {value: "fr", label:"French"},  {value: "sp", label:"Spanish"}]}/>
              </Box>
            </Grid>
            <Tabs margin="medium">
              <Tab title="Plain Text">
                <Box pad="medium">
                  <TextArea 
                    name='plainText' 
                    error={this.state.touched.plainText && this.state.errors.plainText} 
                    onChange={this.handleUserInput} 
                    onBlur={this.handleBlur} 
                    value={this.state.values.plainText} 
                    placeholder="Type your article here" />
                  <Button disabled={!this.isFormValid()} onClick={this.submitPlainText} type="submit" fill={true} primary color="accent-1" label="Generate" />
                </Box>
              </Tab>
            </Tabs>
          </Form>
      </Box>
      )
    }
  }

  export default ArticleUpload;


