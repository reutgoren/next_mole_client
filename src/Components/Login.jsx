import React, { Component } from "react";
import '../css/index.css';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { withRouter, Router } from 'react-router-dom';

//import FacebookLogin from 'react-facebook-login';
//import GoogleLogin from 'react-google-login';

//import { BrowserRouter as Router, Switch, Route, Link, Button } from "react-router-dom";

import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

firebase.initializeApp({
  apiKey: "AIzaSyDLoqcbTDMFuurtAyDgVEKZ6qwo0j0Osjk",
  authDomain: "fir-auth-tutorial-ed11f.firebaseapp.com"
})

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ]
};

const MySwal = withReactContent(Swal)

class Login extends Component {

  constructor(props) {
    super(props)
    let local = false;
    this.apiUrl = 'https://localhost:44312/api/';
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
    }
    this.state = {
      userEmail: '',
      userPassword: '',
      isSignedIn: false
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.checkLogin = this.checkLogin.bind(this);


  }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      //console.log("user", user)
    })
  }

  handleEmailChange(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ userPassword: event.target.value });
  }

  checkLogin = (event) => {
    event.preventDefault();
    const check = {
      UserEmail: this.state.userEmail,
      UserPassword: this.state.userPassword
    }

    console.log(check)
    fetch(this.apiUrl + 'user', {
      method: 'GET',
      body: JSON.stringify(check),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        console.log('res=', res);
        return res.json();
      })
      .then(result => {
        console.log(result);
        if (result) {
          this.props.history.push("/home");
        }
        else {
          MySwal.fire("Email or password are incorrect, please try again", "", "warning")
        }
      },
        (error) => {
          console.log("err post=", error);
        });
    console.log(this.state.usersLiked);

  }

  render() {
    return (

      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>
            <form onSubmit={this.checkLogin}>
              <h3>Sign In</h3>

              <div className="form-group">
                <label>Email address</label>
                <input type="email" name="userEmail" onChange={this.handleEmailChange}
                  className="form-control" placeholder="Enter email" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="userPassword" onChange={this.handlePasswordChange}
                  className="form-control" placeholder="Enter password" />
              </div>

              <div className="form-group">
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="customCheck1" />
                  <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                </div>
              </div>

              <button type="submit" className="btn btn-info btn-block">Submit</button>
              <p className="forgot-password text-right text-info">

                <Link className="nav-link" to="/sign-up">Not registered yet?</Link>
              </p>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />

            </form>
          </div>

        </div>
      </div>
    );
  }
}
export default withRouter(Login);


const divStyle = {
  //padding:'150px'

}