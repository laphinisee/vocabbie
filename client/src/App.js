import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Grommet, Box } from 'grommet';

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Sheet from "./Sheet";
import Upload from "./Upload";
import UserSheets from "./UserSheets";
import Settings from "./Settings";
import jwt_decode from 'jwt-decode';

class App extends React.Component {

  constructor(props) {
    super(props);
    const token = localStorage.getItem('JWT')
    this.state = {
      token: token,
      user: token ? jwt_decode(localStorage.getItem('JWT')) : null,
    }
  };

  onLogin = (token) => {
    const user = jwt_decode(token);
    this.setState({token, user}, () => {
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
  
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={(props) => (
        this.state.token
          ? <Component user={this.state.user} {...props} />
          : <Redirect to='/login' />
      )} />
    )

    return (
      <BrowserRouter>
        <Grommet theme={theme} full>
          <Box fill>
            <Navbar loggedIn={this.state.token !== null} user={this.state.user} onLogout={this.onLogout} />
            <Box flex>
              <Switch>
                <Route exact path='/' component={Home}/>
                <PrivateRoute path='/create' component={Upload} />
                <Route path='/login' render={(routeProps) => (
                  <Login {...routeProps} onLogin={this.onLogin} />
                )} />
                <Route path='/signup' component={Signup} />
                <PrivateRoute path='/settings' component={Settings} />
                <PrivateRoute path='/sheets' component={UserSheets} />
                <PrivateRoute path='/display/:id' component={Sheet} />
              </Switch>
            </Box>
          </Box>
        </Grommet>
      </BrowserRouter>
    )
  }
}

export default App;