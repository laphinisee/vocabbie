import React from "react";
import PageHeader from "./PageHeader";
import { Box } from 'grommet';


class Container extends React.Component {
    render() {
      const {title, description, ...props} = this.props
      return (
        <div className="Container">
            {title && <PageHeader title={title} description={description}/>}
            <Box direction='column' 
                flex 
                overflow={{ horizontal: 'hidden' }} 
                pad={{ left: 'xlarge', right: 'xlarge', top: 'medium'}} {...props}/>
        </div>
      )
    }
  }

export default Container;