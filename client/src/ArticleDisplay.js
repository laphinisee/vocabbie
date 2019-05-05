import React from "react";
import {Box, Text} from 'grommet';
import ReactTooltip from 'react-tooltip'

class Token extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hovered: false,
    }
  }

  onMouseEnter = () => {
    this.setState({hovered: true})
    if (this.props.onHover) {
      this.props.onHover(this.props.token_id)
    }
  }

  onMouseLeave = () => {
    this.setState({hovered: false})
    if(this.props.offHover) {
      this.props.offHover(this.props.token_id)
    }
  }

  render() {
    const hovered = this.state.hovered && !(this.props.isStopword)
    return (
      <span
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        key={this.props.token_id}
        style={
          {
            "fontWeight": hovered ? "bold" : "normal",
            "whiteSpace": "pre-wrap"
          }
        }
        data-html={true}
        data-tip={this.props.isStopword ? '' : (this.props.translated ? `${this.props.translated}` : '') + (this.props.pronunciation ? `<br/>${this.props.pronunciation}` : '')}
      >
        {this.props.str}
      </span>
    )
  }
} 

class ArticleDisplay extends React.Component {

  componentDidUpdate () {
    ReactTooltip.rebuild()
  }

  processArticle = (article, t) => {
    const tokens = t.slice(0) 
    const display = []
    let currentText = article
    let currentToken = tokens.shift()
    while(currentToken) { 
      if(currentText.startsWith(currentToken.str)) {
        display.push(
          <Token 
            str={currentToken.str} 
            token_id={currentToken.id} 
            key={display.length}
            translated={currentToken.def} 
            pronunciation={currentToken.pronunciation}
            isStopword={currentToken.isStopword}
            onHover={this.props.onWordHover}
            offHover={this.props.offWordHover}
          />
        )
        currentText = currentText.substr(currentToken.str.length)
        currentToken = tokens.shift()
      } else {
        const nextTokenLocation = currentText.indexOf(currentToken.str)
        const whitespace = currentText.substr(0, nextTokenLocation) 
        display.push(
          <Token 
            key={display.length}
            str={whitespace}  
            onHover={this.props.onWordHover}
            offHover={this.props.offWordHover}
          />
        )
        currentText = currentText.substring(nextTokenLocation)
      }
    }
    return display
  }

  render() {
    return (
      <Box pad="medium">
        <ReactTooltip html={true} />
        <Text>
          {this.processArticle(this.props.article, this.props.tokens)}
        </Text>
      </Box>
    )
  }
}

  export default ArticleDisplay;


