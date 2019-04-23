import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grommet, Box } from 'grommet';

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Sheet from "./Sheet";
import Upload from "./Upload";
import UserSheets from "./UserSheets";
import Settings from "./Settings";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('JWT'),
    }
  };

  onLogin = (token) => {
    this.setState({token}, () => {
      console.log("token updated:", this.state.token)
    })
  }

  onLogout = () => {
    this.setState({token: null}, localStorage.removeItem('JWT'))
  }

  render() {
    const theme = {
      global: {
        colors: {
          brand: '#3498db',
          'neutral-2': '#1845b2',
          'accent-1': '#1845b2',
        },
        font: {
          family: 'Roboto',
          size: '14px',
          height: '20px',
        },
        button: {
          color: "light"
        },
        focus: {
          border: {
            color: '#1845b2'
          }
        }
      },
    };

    return (
      <BrowserRouter>
        <Grommet theme={theme} full>
          <Box fill>
            <Navbar loggedIn={this.state.token !== null} onLogout={this.onLogout} />
            <Box flex>
              <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/create' component={Upload} />
                <Route path='/login' render={(routeProps) => (
                  <Login {...routeProps} onLogin={this.onLogin} />
                )} />
                <Route path='/signup' component={Signup} />
                <Route path='/settings' component={Settings} />
                <Route path='/sheets' component={UserSheets} />
                <Route path='/display/:id' component={Sheet} />
              </Switch>
            </Box>
          </Box>
        </Grommet>
      </BrowserRouter>
    )
  }
}

export default App;