import React from "react";
import {Heading, Box, Button, Grid, Image, Paragraph} from 'grommet';
import map from './images/map.png';
import Container from "./Container";

const Header = (props) => (
  <Box
      className='PageHeader'
      direction='column'
      align='center'
      justify='center'
      background={`url(${map})`}
      pad={{ left: 'medium', right: 'medium', vertical: 'large' }}>
      <Heading textAlign='center' color='white'>Build language fluency with Vocabbie. </Heading>
      <Grid
        rows={['fill']}
        columns={['fill']}
        gap="small"
        areas={[
          { name: 'one', start: [0, 0], end: [0, 0] },
          { name: 'two', start: [1, 0], end: [1, 0] },
        ]}>
        <Box gridArea='one'><Button href='/signup' color="white" primary={true} label="Get Started" /></Box>
        <Box grideArea='two'><Button href='/login' color="white" primary={true} label="Keep Going" /></Box>
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
        <div>
          <Header/>
          <Container>
              <Box direction="column" flex="grow">
                <Grid
                  rows={['medium', 'medium']}
                  columns={['1/3', '1/3', '1/3']}
                  gap="large"
                  margin="large"
                  areas={[
                    {name: 'left1', start: [0,0], end: [1,0]},
                    {name: 'right1', start: [1,0], end: [2,0]},
                    {name: 'left2', start: [0,1], end: [2,1]},
                    {name: 'right2', start: [2,1], end: [2,1]},
                  ]}>
                  <Box gridArea='left1'>
                    <Heading level={2} color="neutral-2">What is Vocabbie?</Heading>
                    <Paragraph>Take any article or web page and generate a vocabulary sheet out of it. Vocabbie's algorithm will take the hardest vocabulary words, and prune the words you don't need to study.</Paragraph>
                    <Paragraph>Need to remove or add words to your sheets? Customizing your sheets is easy.</Paragraph>
                    <Button label="Start now" href="signup" alignSelf="start" color="neutral-2"/>
                  </Box>
                  <Box gridArea='right1'>
                    <Image fit="cover" src="/img1.jpg"/>
                  </Box>
                  <Box gridArea='left2'>
                    <Image fit="cover" src="/img2.jpg"/>
                  </Box>
                  <Box gridArea='right2'>
                    
                    <Heading level={2} color="neutral-2">Spend less time on busywork, and more time on learning.</Heading>
                    <Paragraph>Spend less time looking for study materials online. Make your own in no time at all.</Paragraph>
                    <Paragraph>Export your vocab sheets into PDFs and flash cards for on-the-go studying.</Paragraph>
                    <Button label="Start learning" href="signup" alignSelf="start" color="neutral-2"/>
                  </Box>
                </Grid>
              </Box>
          </Container>
        </div>
      )
    }
  }

  export default Home;