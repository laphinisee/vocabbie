const classNames = require('classnames')
import React from "react";

class InputField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
      return (
        <input type={this.props.type} onChange={this.props.onChange} placeholder={this.props.placeholder} className={classNames('inputField', this.props.className)} />
      )
    }
  }

  export default InputField;