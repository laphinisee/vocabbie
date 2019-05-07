
import React from "react";
import {Page, Text, View, Font, Document, StyleSheet } from '@react-pdf/renderer';

class PDFSheet extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          title: props.title,
          vocabRows: props.vocabRows,
      }
    }
  
    componentWillReceiveProps(nextProps) { 
      if (nextProps.title !== this.props.title){
        this.setState({title:nextProps.title});
      }
      if (nextProps.vocabRows !== this.props.vocabRows){
        this.setState({vocabRows:nextProps.vocabRows});
      }
    }
    render() {
      Font.register({ family: 'Roboto', src: '/Roboto-Regular.ttf' });
      Font.register({ family: 'RobotoMedium', src: '/Roboto-Medium.ttf' });
      const styles = StyleSheet.create({
        page: {
          margin: 10,
          padding: 10,
          fontFamily: 'Roboto',
          fontSize: 14,
        },
        title: {
          fontFamily: 'RobotoMedium',
          fontSize: 24,
          marginBottom: 10,
          color: "#1845b2",
        },
        vocab: {
          paddingLeft: 20,
          paddingRight: 40,
        },
        entry: {
          justifyContent: "space-between",
          flexDirection: 'row',
          alignContent: "space-between",
          borderBottomStyle: "solid",
          borderBottomColor: "#aaa",
          borderBottomWidth: 1,
          paddingVertical: 5,
        },
        numText: {
          flexDirection: 'row',
          width: "8cm",
          fontFamily: 'RobotoMedium'
        },
        pos: {
          width: "8cm",
        },
        number: {
          fontSize: 10,
          color: "#aaa",
          marginVertical: 5,
          marginHorizontal: 10,
        }
      });
      return (
      <Document title={this.state.title}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Vocabbie - {this.props.title}</Text>
          </View>
          <View style={styles.vocab}>
          {Object.keys(this.state.vocabRows).map((v,i) => {
            console.log(this.state.vocabRows[v])
            return (
              <View style={styles.entry}>
                <View style={styles.numText}>
                  <Text style={styles.number}>{i + 1}</Text>
                  <Text>{this.state.vocabRows[v].text}</Text>
                </View>
                <Text>{this.state.vocabRows[v].translation}</Text>
              </View>
              );
          })}
          </View>
        </Page>
      </Document>
      )
    }
  }
  
  export default PDFSheet;