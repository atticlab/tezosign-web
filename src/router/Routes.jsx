import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../pages/home';
import SelectMultisig from '../pages/select-multisig';
import CreateMultisig from '../pages/create-multisig';
import Multisig from '../pages/multisig';
import NotFound from '../pages/not-found';
import Deployed from '../pages/deployed';
import useLocationBlocker from './useLocationBlocker';
import GuardedRoute from './GuardedRoute';
import { useUserStateContext } from '../store/userContext';

const Routes = () => {
  useLocationBlocker();
  const { isLoggedIn } = useUserStateContext();

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <GuardedRoute
        path="/select-multisig"
        component={SelectMultisig}
        isLoggedIn={isLoggedIn}
      />
      <GuardedRoute
        path="/create-multisig"
        component={CreateMultisig}
        isLoggedIn={isLoggedIn}
      />
      <GuardedRoute
        path="/multisig/:address"
        component={Multisig}
        isLoggedIn={isLoggedIn}
      />
      <GuardedRoute
        path="/deployed"
        component={Deployed}
        isLoggedIn={isLoggedIn}
      />
      <Route path="/not-found">
        <NotFound />
      </Route>
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
