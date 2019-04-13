import React from "react";
import ArticleDisplay from './ArticleDisplay';
import Container from './Container';
import VocabDisplay from './VocabDisplay';
import {Grid, Box} from 'grommet';

class Sheet extends React.Component {

    render() {
      return (
        <Container title="Your Vocabulary" description="Your generated vocab sheet">
          <Grid
          rows={['full']}
          columns={['1/2', '1/2']}
          gap="small"
          fill="true"
          areas={[
            { name: 'article', start: [0, 0], end: [1, 0] },
            { name: 'vocab', start: [1, 0], end: [1, 0] },
          ]}
        >
            <Box gridArea="article" background="light-2"/>
              <ArticleDisplay />
            <Box gridArea="vocab" background="light-5">
              <VocabDisplay />
            </Box>
          </Grid>
         </Container>
      )
    }
  }

  export default Sheet;


