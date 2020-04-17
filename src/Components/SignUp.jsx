import React, { Component } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { withRouter, Router } from 'react-router-dom';

import '../css/index.css';

class SignUp extends Component {
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

                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>

                        <p className="forgot-password text-right">
                            <Link className="nav-link" to="/">Already registered?</Link>

                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
export default withRouter(SignUp);  