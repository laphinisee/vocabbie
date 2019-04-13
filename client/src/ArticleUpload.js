import React from "react";
import {Form, Tabs, Tab, Box, Button, TextArea, } from 'grommet';

class ArticleUpload extends React.Component {

    render() {
      return (
        <Box pad="medium">
          <Tabs>
            <Tab title="Plain Text">
              <Box pad="medium">
              <Form>
                <TextArea placeholder="Type your article here" />
                <Button type="submit" primary label="Submit" />
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


