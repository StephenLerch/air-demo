import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './Home';
import Login from './Login';

const App = () => (
  <div className="app-routes">
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
    </Switch>
  </div>
);

export default App;
