import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        {/* with Switch, only search the first match, and do not check the rest */}
        <Switch>
          {/* with Redirect, redirect from some path to some else path */}
          <Redirect from='/' to='/auth' exact />
          <Route path='/auth' exact component={AuthPage} />
          <Route path='/events' exact component={EventsPage} />
          <Route path='/bookings' exact component={BookingsPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
