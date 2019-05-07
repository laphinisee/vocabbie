import React from "react";
import Container from './Container';
import PDFSheet from './PDFSheet'
import {Button, Box} from 'grommet';
import {FormPrevious} from 'grommet-icons'
import {PDFViewer} from '@react-pdf/renderer';
import { withRouter } from "react-router";

class Export extends React.Component {

    render() {
      return (
        <Container title={this.props.location.state.title} description="Download your exported sheet">
            <Box pad="small">
                <Button icon={<FormPrevious/>} label="Back to Sheet" onClick={() => this.props.history.goBack()} alignSelf="start" color="white"/>
            </Box>
            <PDFViewer height="1200px">
                <PDFSheet title={this.props.location.state.title} vocabRows={this.props.location.state.vocabRows}/>
            </PDFViewer>
         </Container>
      )
    }
  }

  export default withRouter(Export);


