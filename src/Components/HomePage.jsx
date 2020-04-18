import React, { Component } from 'react';
//import './App.css';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import User from '../images/User.png'
import Form from 'react-bootstrap/Form';
//import { Jumbotron as Jumbo } from 'react-bootstrap';
import styled from 'styled-components';
import net1 from '../images/net1.png';

import { withRouter } from 'react-router-dom';

import Upload from '../Components/Upload.jsx';
//import homecss from '../css/homecss.css'

//import logo from '../images/logo.png';
import logo2 from '../images/logo2.png';
import Nav from '../Components/Nav';

import JsonUpload from '../Components/JsonUpload';
//import { color } from 'd3';


const Styles = styled.div`
  .jumbo {
    background: url(${net1}) no-repeat fixed bottom;
    background-size: cover;
    color: #efefef;
    height: 360px;
    position: relative;
    z-index: -2;
  }
  .overlay {
    background-color: #000;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
  .header{
    margin: 40px 20px;
    textAligh: left;
    border: 2px solid red;
  }
  .temp{
   
    align-items: center;
    justify-content: center;
  }
`;

class HomePage extends Component {
  constructor(props) {
    super(props)

    //let local = false;
    let local = true;
    this.apiUrl = 'https://localhost:44312/api/';
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
    }
  }


  state = {

    jsonSubject: '',
    jsonDescription: '',
    jsonData: '',
    jsonImage: '',

  }

  getJsonData = (data) => {
    console.log("data from child to parent: " + data)
    this.setState({
      jsonData: JSON.parse(data)
    })
    console.log(this.state.jsonData)
    //alert('homepage line 76 ' + this.state.jsonData)

  }

  getJsonImage = (data) => {
    console.log("image from chile to parent: " + data)
    this.setState({
      jsonImage: data
    })
    console.log(this.state.jsonImage)
    alert('homepage line 86 ' + this.state.jsonImage)
  }

  handleSubmit = (e) => {
    let sub = e.target.elements.formSubject.value;
    let des = e.target.elements.formDescription.value;
    this.setState({
      jsonSubject: sub,
      jsonDescription: des
    }, () => {
      this.props.history.push({
        pathname: '/graph',
        state: {
          jsonSubject: this.state.jsonSubject,
          jsonDescription: this.state.jsonDescription,
          jsonData: this.state.jsonData,
          jsonImage: this.state.jsonImage
        }
      });
    })

    console.log(sub)                                //מציג טוב! את מה שאני צריכה

  }

  render() {

    return (
      <div>
        <Nav />
        <Styles>
          <Container fluid className='jumbo'>
            <div style={{ overflow: "hidden", maxHeight: 360, marginTop: 60, maxWidth: "100%" }} className='overlay'>
              <Row>
                <Col xs={6} style={{ maxHeight: 250 }}>
                  <h3 style={{ opacity: 0.5, color: 'rgba(240, 255, 240)', marginTop: 50, marginLeft: 10, textAlign: 'left' }}>Welcome To The Mole's</h3>
                  <h5 style={{ opacity: 0.5, color: 'rgba(240, 255, 240)', marginLeft: 10, textAlign: 'left' }}>Worlds Creation Site</h5>
                  <p style={{ opacity: 0.5, color: 'rgba(240, 255, 240)', marginLeft: 10, textAlign: 'left' }}>
                    Here you can create your oun world by choice</p>
                </Col>
                <Col xs={6} >
                  <Row style={{ marginTop: 30 }} ><Col style={{}} className="temp" md={6} xs={12}><img alt='' style={{ maxHeight: 140, maxWidth: 140 }} src={logo2} /></Col>
                    <Col style={{ paddingRight: 10, marginTop: 10 }} className="temp" xs={12} md={6}> <img alt='' style={{ zIndex: '100', Height: 120, maxWidth: 100 }} src={User} />
                      <p>User Name</p></Col></Row>
                </Col>
              </Row>
            </div>
          </Container>
        </Styles>

        <Container style={{ marginLeft: 0, marginTop: 30 }}>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Group as={Row} controlId="formSubject">
              <Form.Label column sm="2">
                Subject
    </Form.Label>
              <Col sm="10">
                <Form.Control name='subject' type="text" inputref={(ref) => { this.subject = ref }} placeholder="Add Subject" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formDescription">
              <Form.Label column sm="2">
                Description
    </Form.Label>
              <Col sm="10">
                <Form.Control type="text" name='description' inputref={(ref) => { this.description = ref }} placeholder="Add description" />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Col xs={6}>
                <Row>
                  <Form.Label column sm="4">
                    Data
    </Form.Label>
                  <Col sm="8">
                    <JsonUpload sendJsonData={this.getJsonData} />
                  </Col>
                </Row>

              </Col>
              <Col xs={6}>
                <Row>
                  <Form.Label column sm="4">
                    Theme Image
    </Form.Label>
                  <Col sm="8">
                    <Upload sendJsonImage={this.getJsonImage} />
                  </Col>
                </Row>

              </Col>

            </Form.Group>
            <Row>
              <Col sx={12}>
                <Button type="submit" className="bg-info" style={styleBTN} >Create</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

    )
  }
}

export default withRouter(HomePage);



const styleBTN = {

  //fontFamily: 'Roboto medium, sans-serif',
  fonSize: '14px',
  display: 'inline-block',
  height: '56px',
  miWidth: '88px',
  justifyContent: 'center',
  padding: '6px 16px',
  marginBottom: '30px',
  lineHeight: 1.42857143,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  //-ms-touch-action: manipulation;
  //touch-action: manipulation;
  cursor: 'pointer',
  //-webkit-user-select: none;
  //-moz-user-select: none;
  //-ms-user-select: none;
  //user-select: none;
  border: 0,
  borderRadius: '5px',
  background: 'rgba(103, 58, 183, 1)',
  color: '#fff',
  outline: 0,

}