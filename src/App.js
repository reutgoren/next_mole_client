import React from 'react';
import './css/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
//import firebase from 'firebase';

import HomePage from "./Components/HomePage.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import GraphEx from "./Components/GraphEx.jsx";

function App() {
  return (

    <div className="App">
      <Switch>
        <Route exact path="/"> <Login/> </Route>
        <Route path="/sign-up" component={SignUp} />
        <Route path="/home"> <HomePage /> </Route>
        <Route path="/graph"> <GraphEx/>  </Route>
      </Switch>
    </div>

  );
}
export default App;
