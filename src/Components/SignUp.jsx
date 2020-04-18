import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter, Router } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../css/index.css';

const MySwal = withReactContent(Swal)



class SignUp extends Component {

    constructor(props) {
        super(props)
        let local = false;
        //let local = true
        this.apiUrl = 'https://localhost:44312/api/';
        if (!local) {
          this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
        }
        this.state = {
          userEmail: '',
          userPassword: '',
          userName:'',
          userBirthdate:'',
          userGender:''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.checkLogin = this.checkLogin.bind(this);  
      }

      handlePasswordChange(event) {
        this.setState({ userPassword: event.target.value });
      }
      handleUserNameChange(event) {
        this.setState({ userName: event.target.value });
      }
    
      handleBirthdateChange(event) {
        this.setState({ userBirthdate: event.target.value });
      }
      handleGenderChange(event) {
        this.setState({ userGender: event.target.value });
      }
            
    signUser = (event) => {
        event.preventDefault();
        const userToPost={
            UserEmail: this.state.userEmail,
            UserPassword: this.state.userPassword,
            UserName: this.state.userName,
            UserBirthdate: this.state.userBirthdate,
            Gender: this.state.userGender
        }

        fetch(this.apiUrl, {
          method: 'POST',
          body: JSON.stringify(userToPost),
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
              MySwal.fire("This email address is allready registered, please sign up with a different address", "", "warning")
            }
          },
            (error) => {
              console.log("err post=", error);
            });
      }

    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form>
                        <h3>Sign Up</h3>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Enter password" />
                        </div>
                        <div className="form-group">
                            <label>User name</label>
                            <input type="text" className="form-control" placeholder="Enter user name" />
                        </div>
                        <div className="form-group">
                            <label>Date of birth</label>
                            <input type="text" className="form-control" placeholder="Enter birthdate" />
                        </div>
                        <div className="form-group">
     
                            <label>Gender</label><br/>
                            &nbsp;<input type="radio" name="gender" value="Male"  /> <label>Male</label><br/>
                            &nbsp;<input type="radio" name="gender"  value="Female" /> <label>Female</label>
                        </div>
                        <button type="submit" className="btn btn-info btn-block">Sign Up</button>
                        <p className="forgot-password text-right">
                            <Link className="nav-link text-info" to="/">Already registered?</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
export default withRouter(SignUp);  