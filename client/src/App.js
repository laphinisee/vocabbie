import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grommet, Box } from 'grommet';

import Home from "./Home";
import Navbar from "./Navbar";

class App extends React.Component {

  render() {
    const theme = {
      global: {
        colors: {
          brand: '#228BE6',
          'neutral-2': '#3D138D',
        },
        font: {
          family: 'Roboto',
          size: '14px',
          height: '20px',
        },
      },
    };

    return (
      <BrowserRouter>
        <Grommet theme={theme} full>
          <Box fill>
            <Navbar />
            <Box direction='row' flex overflow={{ horizontal: 'hidden' }} pad={{ left: 'medium', right: 'medium', top: 'medium'}}>
              <Box flex align='left'>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/create' component={Home} />
                  <Route path='/login' component={Home} />
                  <Route path='/signup' component={Home} />
                  <Route path='/settings' component={Home} />
                  <Route path='/:id/sheets' component={Home} />
                  <Route path='/display' component={Home} />
                </Switch>
              </Box>
            </Box>
          </Box>
        </Grommet>
      </BrowserRouter>
    )
  }
}

export default App;