
import React from "react";
import {Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

class PDFSheet extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          title: props.title,
          tokens: props.tokens,
      }
    }
  
    componentWillReceiveProps(nextProps) { 
      if (nextProps.title !== this.props.title){
        this.setState({title:nextProps.title});
      }
      if (nextProps.tokens !== this.props.tokens){
        this.setState({tokens:nextProps.tokens});
      }
    }
    render() {
      const styles = StyleSheet.create({
        page: {
          flexDirection: 'row',
        },
        section: {
          margin: 10,
          padding: 10,
          flexGrow: 1
        }
      });
    //   console.log(props.title)
      console.log(this.state.title)
      return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>{this.state.title}</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
      )
    }
  }
  
  export default PDFSheet;