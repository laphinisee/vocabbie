import React from "react";
import PageHeader from "./PageHeader";
import { Box } from 'grommet';


class Container extends React.Component {
    render() {
      const {title, description, ...props} = this.props
      return (
        <div className="Container">
            {title && <PageHeader title={title} description={description}/>}
            <Box direction='row' 
                flex 
                overflow={{ horizontal: 'hidden' }} 
                pad={{ left: 'medium', right: 'medium', top: 'medium'}} {...props}/>
        </div>
      )
    }
  }

export default Container;