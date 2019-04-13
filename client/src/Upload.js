import React from "react";
import Container from './Container';
import ArticleUpload from './ArticleUpload';

class Upload extends React.Component {

    render() {
      return (
         <Container title="Content Upload" description="Upload an article">
          <ArticleUpload />
         </Container>
      )
    }
  }

  export default Upload;
