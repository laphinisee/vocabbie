import React from "react";
import {Heading, Box, Button, Grid, Paragraph} from 'grommet';
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
      <Heading color='white'>Build language fluency with Vocabbie. </Heading>
      <Grid
        rows={['fill']}
        columns={['fill']}
        gap="small"
        areas={[
          { name: 'one', start: [0, 0], end: [0, 0] },
          { name: 'two', start: [1, 0], end: [1, 0] },
        ]}>
        <Box gridArea='one'><Button color="white" primary={true} label="Get Started" /></Box>
        <Box grideArea='two'><Button color="white" primary={true} label="Keep Going" /></Box>
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
              <Box direction="column" fill="true" flex="grow">
                <Heading level={2}>Why use Vocabbie?</Heading>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia sapien in lectus pharetra, ut efficitur ligula finibus. Nullam id odio at tellus maximus semper at quis tortor. Nulla id metus vel ante bibendum pretium. Proin a vehicula neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa tortor, venenatis id ligula a, pulvinar ullamcorper purus. Quisque tristique enim ac sodales iaculis. Sed vehicula sem non mi rutrum mattis. Etiam pellentesque, arcu a aliquet eleifend, mauris metus imperdiet arcu, et facilisis nibh enim at nunc. Nulla volutpat urna vitae tortor ultrices rutrum. Sed ullamcorper lorem posuere lectus blandit, vitae laoreet massa efficitur. Vivamus dignissim magna nulla, quis tristique lorem porta eget. Fusce mollis tincidunt sem, sed fermentum enim efficitur volutpat.
                </p>
                <p>
                  In rutrum lectus sapien, id sollicitudin ex lacinia mattis. Curabitur nibh ante, dignissim ac vulputate vel, ultrices quis felis. Vivamus vehicula felis a vehicula dapibus. Ut sodales turpis eget venenatis luctus. Phasellus fermentum lacus non dolor dapibus dignissim. Sed sed justo diam. Vivamus ligula turpis, dictum ut lacus eget, scelerisque commodo erat. Sed semper lorem quis odio lacinia placerat. Integer aliquam hendrerit velit at varius. Proin vulputate erat tellus, eget ornare ligula viverra ac. Sed semper ante at odio fringilla, eget facilisis sapien gravida. Nulla vel egestas dolor, vitae congue massa.
                </p>
              </Box>
              <Box
                className='PageHeader'
                direction='column'
                align='left'
                justify='left'
                background='neutral-2'
                pad={{ left: 'xlarge', right: 'xlarge', vertical: 'large' }}>
                <Paragraph margin="none">Ready</Paragraph>
              </Box>
              <Box direction="column" fill="true" flex="grow">
                <Heading level={2}>Vocabbie gets results. </Heading>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia sapien in lectus pharetra, ut efficitur ligula finibus. Nullam id odio at tellus maximus semper at quis tortor. Nulla id metus vel ante bibendum pretium. Proin a vehicula neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa tortor, venenatis id ligula a, pulvinar ullamcorper purus. Quisque tristique enim ac sodales iaculis. Sed vehicula sem non mi rutrum mattis. Etiam pellentesque, arcu a aliquet eleifend, mauris metus imperdiet arcu, et facilisis nibh enim at nunc. Nulla volutpat urna vitae tortor ultrices rutrum. Sed ullamcorper lorem posuere lectus blandit, vitae laoreet massa efficitur. Vivamus dignissim magna nulla, quis tristique lorem porta eget. Fusce mollis tincidunt sem, sed fermentum enim efficitur volutpat.
                </p>
                <p>
                  In rutrum lectus sapien, id sollicitudin ex lacinia mattis. Curabitur nibh ante, dignissim ac vulputate vel, ultrices quis felis. Vivamus vehicula felis a vehicula dapibus. Ut sodales turpis eget venenatis luctus. Phasellus fermentum lacus non dolor dapibus dignissim. Sed sed justo diam. Vivamus ligula turpis, dictum ut lacus eget, scelerisque commodo erat. Sed semper lorem quis odio lacinia placerat. Integer aliquam hendrerit velit at varius. Proin vulputate erat tellus, eget ornare ligula viverra ac. Sed semper ante at odio fringilla, eget facilisis sapien gravida. Nulla vel egestas dolor, vitae congue massa.
                </p>
              </Box>
          </Container>
        </div>
      )
    }
  }

  export default Home;