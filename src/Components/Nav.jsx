import React, { Component } from 'react'
import { Navbar , Nav as Nav1} from 'react-bootstrap';



export default class Nav extends Component {


    render() {
        return (
            <div>
                <Navbar fixed='top' bg="light" variant="light">
                    <Navbar.Brand href="#home">The Mole</Navbar.Brand>
                    <Nav1 className="mr-auto">
                        <Nav1.Link href="/home" className="nav-link">
                            Home
          </Nav1.Link>
                        <Nav1.Link href="/sign-in" className="nav-link">
                            Login
          </Nav1.Link>
                        <Nav1.Link href='/sign-up' className="nav-link">
                            Sign up
            </Nav1.Link>
                        <Nav1.Link href="/graph" className="nav-link" >
                            graph
           </Nav1.Link>
                    </Nav1>

                </Navbar>
            </div>
        )
    }
}
