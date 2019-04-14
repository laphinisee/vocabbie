import React from "react";
import Container from './Container';
import {Form, FormField, Button, Grid, Box, Heading, Paragraph} from 'grommet';
import TypeOut from 'react-typeout';

class Signup extends React.Component {

    render() {
      const words = ['Let\'s learn.', 'Aprendamos.', '让我们来学习', 'Lass uns lernen']
      return (
        <Container title="Sign Up" description="Let's begin your journey with a new language.">
        <Grid
        rows={['fill']}
        columns={['fill', 'fill']}
        fill="true"
        areas={[
            {"name": "one", "start": [0, 0], "end": [0, 0]},
            {"name": "two", "start": [1, 0], "end": [1, 0]},
         ] }
        gap="small"
        >
            <Box gridArea="one" align="center">
                <Heading color='neutral-2' level={1}>
                    <TypeOut caret words={words} />
                </Heading>
                <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing 
                    elit. Praesent sed metus feugiat, bibendum arcu sit amet, 
                    ultricies tellus. Nulla ac consequat eros. Nunc placerat 
                    elementum iaculis. Ut auctor congue mauris, a lacinia leo 
                    maximus id. Vivamus eleifend orci quis imperdiet convallis. 
                    Nam volutpat eget lorem et elementum. Sed condimentum 
                    rhoncus mi, eget vulputate lorem luctus quis.</Paragraph>
            </Box>
            <Box gridArea="two">
                <Paragraph justify="center" align="center">
                    To get started, simply make an account or sign up using Facebook or Google.
                </Paragraph>
                <Form>
                    <FormField name="email" type="email" label="Email Address" />
                    <FormField name="password" type="password" label="Password" />
                    <Button type="submit" primary label="Sign Up" />
                </Form>
            </Box>
        </Grid>
        </Container>
      )
    }
  }

  export default Signup;