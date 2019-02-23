import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {/* // Consumer will get the context value */}
    {context => {
      return (
        <header className='main-navigation'>
          <div className='main-navigation__logo'>
            <h1>Event Care</h1>
          </div>
          <nav className='main-navigation__items'>
            <ul>
              {/* // only rendered Authenticate while not authenticated */}
              {!context.token && (
                <li>
                  <NavLink to='/auth'>Authenticate</NavLink>
                </li>
              )}
              <li>
                <NavLink to='/events'>Events</NavLink>
              </li>
              {/* // only rendered after authenticated */}
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to='/bookings'>Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
