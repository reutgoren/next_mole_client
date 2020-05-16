import React from 'react';
import './css/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./Components/HomePage.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import GraphEx from "./Components/GraphEx.jsx";


function App() {
  return (

    <div className="App">
      <Switch>
        <Route exact path="/"> <Login/> </Route>
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/home"> <HomePage /> </Route>
        <Route exact path="/graph"> <GraphEx/>  </Route>
      </Switch>
    </div>

  );
}
export default App;
