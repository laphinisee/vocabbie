import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grommet, Box } from 'grommet';

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Sheet from "./Sheet";
import Upload from "./Upload";


class App extends React.Component {

  render() {
    const theme = {
      global: {
        colors: {
          brand: '#3498db',
          'neutral-2': '#1845b2',
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
            <Box flex align='left' >
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/create' component={Upload} />
                <Route path='/login' component={Login} />
                <Route path='/signup' component={Signup} />
                <Route path='/settings' component={Home} />
                <Route path='/:id/sheets' component={Home} />
                <Route path='/display' component={Sheet} />
              </Switch>
            </Box>
          </Box>
        </Grommet>
      </BrowserRouter>
    )
  }
}

export default App;