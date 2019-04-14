import React from "react";
import {Heading, Box, Button, Grid} from 'grommet';
import map from './images/map.png';

const Header = (props) => (
  <Box
      className='PageHeader'
      direction='column'
      align='center'
      justify='center'
      background={`url(${map})`}
      pad={{ left: 'medium', right: 'medium', vertical: 'large' }}>
      <Heading color='white'>Build language fluency with Vocabbie. </Heading>
      <Grid
        rows={['fill']}
        columns={['fill']}
        gap="small"
        areas={[
          { name: 'one', start: [0, 0], end: [0, 0] },
          { name: 'two', start: [1, 0], end: [1, 0] },
        ]}>
        <Box gridArea='one'><Button primary={true} label="Get Started" /></Box>
        <Box grideArea='two'><Button primary={true} label="Keep Going" /></Box>
      </Grid>
   </Box>
)

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
      return (
        <Header/>
      )
    }
  }

  export default Home;