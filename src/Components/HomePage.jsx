import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import User from '../images/User.png'
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';
import net1 from '../images/net1.png';
import bg from '../images/bgHomePage.png';
import { withRouter } from 'react-router-dom';
import logo2 from '../images/logo2.png';
import Nav from '../Components/Nav';
import UploadJson from './UploadJson';
import UploadImage from './UploadImage.jsx';
import Category from './Category';
import PopNet from './PopNet';
import '../css/homecss.css';
import Popup from "reactjs-popup";
import '../css/Popup.css';


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal)

var net = false;


class HomePage extends Component {
  constructor(props) {
    super(props)

    let local = false;
    //let local = true;
    this.apiUrl = 'https://localhost:44312/api/';
    if (!local) {
      this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
    }
    this.state = {

      jsonSubject: '',
      jsonDescription: '',
      jsonRowData: '',
      jsonImage: '',
      existingCategories: [],
      networkToShow: { nodes: ['no nodes to show'], links: ['no links to show'] },
      open: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount = () => {

    this.getCategories();
  }


  getCategories = () => {
    let api = this.apiUrl + "CategoryAmount";
    console.log(api);
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
        if (result != null) {
          //this.setState({existingCategories: result}, ()=>this.getAmountFotCategory())
          this.setState({ existingCategories: result })

        }
        else {
          alert("categories wasn't found")
        }
      },
        (error) => {
          console.log("err=", error);
        });
  }
  handleSubjectChange = (e) => {
    this.setState({ jsonSubject: e.target.value });

  }
  handleDescriptionChange = (e) => {
    this.setState({ jsonDescription: e.target.value });

  }
  getJsonData = (data) => {
    this.setState({
      jsonRowData: JSON.parse(data)
    })

  }

  getJsonImage = (data) => {
    this.setState({
      jsonImage: data
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('jsonRowData', JSON.stringify(this.state.jsonRowData));    // save the raw data from JSON to local storage
    if (e.target.elements.formSubject.value === '') {
      MySwal.fire("Please insert subject", "", "warning")

    }
    else if (e.target.elements.formDescription.value === '') {
      MySwal.fire("Please insert description", "", "warning")

    }
    else if (this.state.jsonRowData === '') {
      MySwal.fire("Please choose file with data", "", "warning")

    }
    else {
      //UploadJson.saveJsonToDB();
      //this.child.getAlert();
      //this.child2.getAlert();
      let str = e.target.elements.formSubject.value.replace(/ /g, "_");
      fetch(this.apiUrl + 'Tables', {        //POST category
        method: 'POST',
        body: JSON.stringify(str),
        //mode: 'no-cors',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      })
        .then(res => {
          console.log('res=', res);
          return res.json()
        })
        .then(
          (result) => {
            console.log("fetch POST= ", result);
          },
          (error) => {
            console.log("err post=", error);
          });

      var jsonDetails = {
        subject: this.state.jsonSubject,
        description: this.state.jsonDescription,
        rawData: this.state.jsonRowData,
        img: this.state.jsonImage
      }
      localStorage.setItem('jsonDetails', JSON.stringify(jsonDetails));    // save all details to local storage
      console.log(jsonDetails);
      this.props.history.push({
        pathname: '/graph',
        state: {
          jsonDetails: jsonDetails
        }
      });
    }
  }

  getNetForCat = (category) => {
    console.log("inside get network");
    let api = this.apiUrl + 'getNetwork/?categoryNAME=' + category;
    console.log(api);
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
        if (result != null) {
          this.setState(prevState => ({
            networkToShow: {
              ...prevState.networkToShow,
              nodes: result.Nodes,
              links: result.Links
            }
          }), ()=>this.openModal())
        }
        else {
          alert("network wasn't found")
        }
      },
        (error) => {
          console.log("err=", error);
        });
  }

  
  openModal() {
    console.log('inside open modal')
    this.setState({ open: true });

  }
  

closeModal() {
  console.log('inside close modal')
  this.setState({ open: false });
}
  render() {
    return (
      <div>
        <Nav />

        <Container fluid className='jumbo'>
          <div style={{ overflow: "hidden", maxHeight: 360, marginTop: 60, maxWidth: "100%" }} className='overlay'>
            <Row>
              <Col xs={6} style={{ maxHeight: 250 }}>
                <h3 style={{ opacity: 0.9, color: 'rgb(22, 25, 22)', marginTop: 50, marginLeft: 10, textAlign: 'left' }}>Welcome To The Mole's</h3>
                <h5 style={{ opacity: 0.9, color: 'rgb(22, 25, 22)', marginLeft: 10, textAlign: 'left' }}>Worlds Creation Site</h5>
                <p style={{ opacity: 0.9, color: 'rgb(22, 25, 22)', marginLeft: 10, textAlign: 'left' }}>
                  Here you can create your oun world by choice</p>
              </Col>
              <Col xs={6} >

                <Row style={{ marginTop: 30 }} >
                  <Col style={{}} className="temp" md={6} xs={12}>
                    {/* <img alt='' style={{ maxHeight: 140, maxWidth: 140 }} src={logo2} /> */}
                  </Col>
                  <Col style={{ paddingRight: 10, marginTop: 10 }} className="temp" xs={12} md={6}> <img alt='' style={{ zIndex: '100', Height: 120, maxWidth: 100 }} src={User} />
                    <p>User Name</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
        <Container>
          <Row>
         <PopNet isOpen={this.state.open} closeModal={this.closeModal} data={this.state.networkToShow}/>
          </Row>

        </Container>
        <Container style={{ marginTop: 30 }}>
          <Row className='justify-content-center'>
            {
              this.state.existingCategories.map((item, i) => <Category key={i} data={item} getNetwork={this.getNetForCat}  />)

            }
          </Row>
          <Row>
            <Form style={{ width: '100%', marginTop: 30 }} noValidate onSubmit={(e) => this.handleSubmit(e)}>
              <Form.Group as={Row} controlId="formSubject">
                <Form.Label column sm="2">
                  Subject
              </Form.Label>
                <Col sm="10">
                  <Form.Control required name='subject' type="text" onChange={this.handleSubjectChange} placeholder="Add subject" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formDescription">
                <Form.Label column sm="2">
                  Description
               </Form.Label>
                <Col sm="10">
                  <Form.Control required type="text" name='description' onChange={this.handleDescriptionChange} placeholder="Add description" />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Col xs={6}>
                  <Row>
                    <Form.Label column sm="4">
                      Data
                  </Form.Label>
                    <Col sm="8">
                      <UploadJson sendJsonData={this.getJsonData} ref={instance => { this.child = instance; }} />
                    </Col>
                  </Row>
                </Col>
                <Col xs={6}>
                  <Row>
                    <Form.Label column sm="4">
                      Theme Image
                   </Form.Label>
                    <Col sm="8">
                      <UploadImage sendJsonImage={this.getJsonImage} ref={instance2 => { this.child2 = instance2; }} />
                    </Col>
                  </Row>
                </Col>
              </Form.Group>
              <Row style={{ padding: 100 }}>
                <Col sx={12}>
                  <Button style={{ padding: '1.175rem 0.75rem', fontSize: '1.1rem', marginBottom: '2rem' }} type="submit" className="btn-info">Build network</Button>
                </Col>
              </Row>
            </Form>
          </Row>
        </Container>
      </div>

    )
  }
}

export default withRouter(HomePage);

