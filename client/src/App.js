import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grommet } from 'grommet';

import Home from "./Home";
import Navbar from "./Navbar";

class App extends React.Component {

  render() {
    const theme = {
      global: {
        font: {
          family: 'Roboto',
          size: '14px',
          height: '20px',
        },
      },
    };

    return (
      <BrowserRouter>
        <Grommet theme={theme}>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/create' component={Home} />
            <Route path='/login' component={Home} />
            <Route path='/signup' component={Home} />
            <Route path='/settings' component={Home} />
            <Route path='/:id/sheets' component={Home} />
            <Route path='/display' component={Home} />

          </Switch>
        </Grommet>
      </BrowserRouter>
    )
  }
}

export default App;