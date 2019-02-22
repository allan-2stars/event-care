import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

// import the context
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter>
        {/* // React.Fragment is a shell HTML element for wrap around. */}
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className='main-content'>
              {/* with Switch, only search the first match, and do not check the rest */}
              <Switch>
                {/* with Redirect, redirect from some path to some else path */}
                {!this.state.token && <Redirect from='/' to='/auth' exact />}
                {this.state.token && <Redirect from='/' to='/events' exact />}
                {this.state.token && (
                  <Redirect from='/auth' to='/events' exact />
                )}
                {!this.state.token && (
                  <Route path='/auth' exact component={AuthPage} />
                )}
                <Route path='/events' exact component={EventsPage} />
                {this.state.token && (
                  <Route path='/bookings' exact component={BookingsPage} />
                )}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
