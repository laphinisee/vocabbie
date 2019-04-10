const classNames = require('classnames')
import React from "react";

class Button extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
      return (
        <input type="button" onClick={this.props.onClick} value={this.props.text} className={classNames('btn', this.props.className)} />
      )
    }
  }

  export default Button;