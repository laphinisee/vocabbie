import React from "react";
import { Box, Heading, Paragraph} from 'grommet';
import './PageHeader.css'

const PageHeader = (props) => (
  <Box
      className='PageHeader'
      direction='column'
      align='left'
      justify='left'
      background='neutral-2'
      pad={{ left: 'xlarge', right: 'xlarge', vertical: 'large' }}>
      <Heading margin="none" level={2}>{props.title}</Heading>
      <Paragraph margin="none">{props.description}</Paragraph>
   </Box>
)

export default PageHeader;