import React from "react";
import PageHeader from "./PageHeader";
import { Box } from 'grommet';
import LoadingScreen from 'react-loading-screen';
import logo from './images/logo-blue.png';


class Container extends React.Component {
    render() {
      const {title, description, loading, ...props} = this.props
      if(!loading) {
        return (
          <div className="Container">
              {title && <PageHeader title={title} description={description}/>}
              <Box direction='column' 
                  flex 
                  overflow={{ horizontal: 'hidden' }} 
                  pad={{ left: 'xlarge', right: 'xlarge', top: 'medium'}} {...props}/>
          </div>
        )
      } else {
        return (
          <LoadingScreen
            loading={true}
            spinnerColor='#324f9c'
            textColor='#676767'
            logoSrc={logo}
            text="Loading..."
          ><p>Loading...</p></LoadingScreen>
        )
      }
    }
  }

export default Container;