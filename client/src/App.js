import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './Home';
import Login from './Login';

const App = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/" component={Home} />
  </Switch>
);

export default App;
