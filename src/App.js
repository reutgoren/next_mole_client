import React from 'react';
import './css/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
//import firebase from 'firebase';
import { Nav, Navbar } from 'react-bootstrap';
import HomePage from "./Components/HomePage.jsx";
import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import GraphEx from "./Components/GraphEx.jsx";

function App() {
  return (
    <Router>
    <div className="App">
      <Navbar fixed='top' bg="light" variant="light">
        <Navbar.Brand href="#home">The Mole</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/home" className="nav-link">
           Home
          </Nav.Link>
          <Nav.Link href="/sign-in" className="nav-link">
            Login
          </Nav.Link>
          <Nav.Link href='/sign-up' className="nav-link">
          Sign up
            </Nav.Link>
          <Nav.Link href="/graph" className="nav-link" >
           graph
           </Nav.Link>
        </Nav>
      </Navbar>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path="/sign-in" component={Login} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/home"> <HomePage /> </Route>
        <Route path="/graph"> <GraphEx/>  </Route>
      </Switch>
    </div>
    </Router >
  );
}
export default App;
