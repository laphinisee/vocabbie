import React from "react";
import {Form, Tabs, Tab, Box, Button, TextArea, } from 'grommet';

class ArticleUpload extends React.Component {

    constructor(props) {
      super(props)
      this.state = {}
    }

    submitPlainText(e) {
      fetch('http://localhost:8888/...', {
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

    plainTextChange(e) {
      this.setState({
        plainText: e.target.value,
      })
    }

    render() {
      return (
        <Box pad="medium">
          <Tabs>
            <Tab title="Plain Text">
              <Box pad="medium">
              <Form>
                <TextArea onChange={this.plainTextChange.bind(this)} placeholder="Type your article here" />
                <Button onClick={this.submitPlainText.bind(this)} type="submit" primary label="Submit" />
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


