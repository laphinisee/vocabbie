import React from "react";
import { Alert, Info } from 'grommet-icons';
import {Box, Text} from 'grommet';


const AlertBox = (props) => {
    const Icon = props.type == 'error' ? Alert : Info;
    return (
    <Box
      className='AlertBox'
      direction='column'
      flex='true'
      direction='row'
      gap='medium'
      alignContent='center'
      background={`status-${props.type}`}
      margin={{"bottom": 'medium'}}
      pad={{ left: 'small', right: 'small', vertical: 'small' }} >
        <Box><Icon color='white'/></Box>
        <Box color='white'><Text color="white">{props.message}</Text></Box>
   </Box>)
}

export default AlertBox;