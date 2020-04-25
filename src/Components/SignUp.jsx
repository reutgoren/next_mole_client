import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../css/index.css';

const MySwal = withReactContent(Swal)



class SignUp extends Component {

    constructor(props) {
        super(props)
        //let local = false;
        let local = true
        this.apiUrl = 'https://localhost:44312/api/';
        if (!local) {
          this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
        }
        this.state = {
          userEmail: '',
          userPassword: '',
          userName:'',
          //userBirthdate:'',
          userGender:''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        //this.handleBirthdateChange = this.handleBirthdateChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.signUser = this.signUser.bind(this);  
      }

      handleEmailChange(event) {
        this.setState({ userEmail: event.target.value });
      }

      handlePasswordChange(event) {
        this.setState({ userPassword: event.target.value });
      }

      handleUserNameChange(event) {
        this.setState({ userName: event.target.value });
      }
    /*
      handleBirthdateChange(event) {
        this.setState({ userBirthdate: event.target.value });
      }
      */
      handleGenderChange(event) {
        this.setState({ userGender: event.target.value });
      }
            
    signUser = (event) => {     //להוסיף ולידציה, שלא יהיה אפשר לאפשר את הטופס מבלי למלא את השדות כראוי


        event.preventDefault();
        const userToPost={
            UserEmail: this.state.userEmail,
            UserPassword: this.state.userPassword,
            UserName: this.state.userName,
            //UserBirthdate: this.state.userBirthdate,
            Gender: this.state.userGender
        }

        fetch(this.apiUrl+'/user', {
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
                    <form onSubmit={this.signUser}>
                        <h3>Create Account</h3>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" onChange={this.handleEmailChange} className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Enter password" />
                        </div>
                        <div className="form-group">
                            <label>User name</label>
                            <input type="text" onChange={this.handleUserNameChange} className="form-control" placeholder="Enter user name" />
                        </div>
                        {/*
                        <div className="form-group">
                            <label>Date of birth</label>
                            <input type="text" onChange={this.handleBirthdateChange} className="form-control" placeholder="Enter birthdate" />
                        </div>
                        */}
                        <div className="form-group">
     
                            <label>Gender</label><br/>
                            &nbsp;<input type="radio" name="gender" value="Male" onChange={this.handleGenderChange} /> <label>Male</label><br/>
                            &nbsp;<input type="radio" name="gender"  value="Female" onChange={this.handleGenderChange}/> <label>Female</label>
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