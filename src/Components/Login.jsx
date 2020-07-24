import React, { Component } from "react";
import '../css/index.css';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { withRouter} from 'react-router-dom';



const MySwal = withReactContent(Swal)

class Login extends Component {

  constructor(props) {
    super(props)
    let local = false;
    //let local = true;
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

  handleEmailChange(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ userPassword: event.target.value });
  }

  checkLogin = (event) => {
    event.preventDefault();
    var emailStr =this.state.userEmail;
    var passwordStr=this.state.userPassword;
    if(emailStr===''){
      MySwal.fire({
        title: 'Error!',
        text: 'You must insert email address',
        icon: 'warning',
        confirmButtonText: 'Ok'
    })
    }
    else if(passwordStr===''){
      MySwal.fire({
        title: 'Error!',
        text: 'You must insert password',
        icon: 'warning',
        confirmButtonText: 'Ok'
    })
    }
    else{
      let api= this.apiUrl+"user/"+emailStr+"/"+passwordStr;
      console.log(api);
      //this.props.history.push("/home");

      fetch(api, {
        method: 'GET',
        //mode: 'no-cors',
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
            MySwal.fire({
              title: 'Login successfully!',
              icon: 'success',
              timer: 1000,
              showConfirmButton:false,
            })
            this.props.history.push("/home");
          }
          else {
            MySwal.fire("Email or password are incorrect, please try again", "", "warning");
            
          }
        },
          (error) => {
            console.log("err=", error);
          });
    }

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
                  className="form-control" placeholder="name@example.com" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="userPassword" onChange={this.handlePasswordChange}
                  className="form-control" placeholder="Enter password" />
              </div>
              <button type="submit" className="btn btn-info btn-block">Submit</button>
              <p className="forgot-password text-right">
                <Link className="nav-link text-info" to="/sign-up">Not registered yet?</Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    );
  }
}
export default withRouter(Login);
