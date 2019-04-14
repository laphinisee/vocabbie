const classNames = require('classnames')
import React from "react";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
      return (
        <div className={classNames('header', this.props.className)}>
            <h2>{this.props.text}</h2>
        </div>
      )
    }
  }

  export default Header;