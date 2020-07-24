import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../css/index.css';
//import { csvParse } from "d3";

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
          userGender:null,
          validation:'True'

        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
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
      handleGenderChange(event) {
        this.setState({ userGender: event.target.value });
      }
            
    signUser = (event) => {   
      
      var counter=0;
      if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}$/i.test(this.state.userEmail)) {    
          counter++;
      }
      else{
        this.setState({validation: 'False'})
      }     
      var pass=this.state.userPassword;
      var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
      var test = reg.test(pass);
        if (test) {
         counter++;

        } else{
            this.setState({validation: 'False'})
            MySwal.fire("Your password must contain at least one uppercase and must be between 8 and 30 characters, please try again", "", "warning")
        }
        
      if(this.state.userGender===null){
        this.setState({validation: 'False'})
        MySwal.fire("select a Gender, please try again", "", "warning")
      }
      else{
          counter++;
      }
      console.log(counter);
   if(counter===3){
        event.preventDefault();
        const userToPost={
            UserEmail: this.state.userEmail,
            UserPassword: this.state.userPassword,
            UserName: this.state.userName,
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
                            <input type="text" onChange={this.handleUserNameChange} className="form-control" placeholder="Full Name" />
                        </div>
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