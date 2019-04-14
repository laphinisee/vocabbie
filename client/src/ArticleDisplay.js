import React from "react";
import {Box} from 'grommet';

class ArticleDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    }

    render() {
      return (
        <Box pad="medium">
            {this.props.content}
        </Box>
      )
    }
  }

  export default ArticleDisplay;


