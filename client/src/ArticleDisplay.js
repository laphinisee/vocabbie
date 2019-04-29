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
            "whiteSpace": "pre"
          }
        }
        data-tip={(this.props.translated ? `${this.props.translated}` : '') + (this.props.translated ? <br/> + `${this.props.translated}` : '')}
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
    let tokenCount = 0;
    while(currentToken && tokenCount < 5000) { 
      if(currentText.startsWith(currentToken.str)) {
        display.push(
          <Token 
            str={currentToken.str} 
            token_id={currentToken.id} 
            key={display}
            translated={currentToken.def} 
            pronunciation={currentToken.pronunciation}
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
      tokenCount += 1
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


