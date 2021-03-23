/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const GuardedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return isLoggedIn ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/not-found',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default GuardedRoute;
