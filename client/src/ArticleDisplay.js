import React from "react";
import {Box} from 'grommet';
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
    return (
      <span
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        key={this.props.token_id}
        style={
          {
            "white-space": "pre"
          }
        }
        data-tip={this.props.translated ? `${this.props.translated}` : ''}
      >
        {this.props.str}
      </span>
    )
  }
} 

class ArticleDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  processArticle = (article, tokens) => {
    const display = []
    let currentText = article
    let currentToken = tokens.shift()
    while(currentToken) { 
      if(currentText.startsWith(currentToken.str)) {
        display.push(
          <Token 
            str={currentToken.str} 
            token_id={currentToken.token_id} 
            translated={currentToken.translated} 
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
        <p>
          {this.processArticle(this.props.article, this.props.tokens)}
        </p>
      </Box>
    )
  }
}

  export default ArticleDisplay;


