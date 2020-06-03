import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Dropdown, FormControl, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { useState } from 'react';


var paths = [];

class Game extends Component {

    constructor(props) {
        super(props)
        //let local = false;
        let local = true;
        this.apiUrl = 'https://localhost:44312/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
        }
        this.state = {
            data: this.props.location.state.finalJson,
            source: '',
            target: '',
            dataForShort: [],
            dataForGame: [[],[],[],[]]

        }
    }

    selectSource = (s) => {
        console.log('source: ', s);
        //console.log(this)
        this.setState({ source: s })

    }

    selectTarget = (t) => {
        console.log('target: ', t);
        this.setState({ target: t })

    }

    startGame = () => {
        console.log("inside play")
        let category = "Game_Of_Thrones";
        let api = this.apiUrl + "networkStartAGame?categoryNAME=" + category;
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
                this.setState({ dataForGame: result })
            },
                (error) => {
                    console.log("err=", error);
                });
    }

    findShortestPaths = () => {
        console.log("inside find shortets paths")
        var source = this.state.source;
        var target = this.state.target;
        //var source = "Aegon Targaryen";
        //var target = "Sandor Clegane";
        let category = "Game_Of_Thrones";
        let api = this.apiUrl + "networkGetPath/?source=" + source + "&target=" + target + '&categoryNAME=' + category;
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
                this.setState(
                    { dataForShort: result[0] })

            },
                (error) => {
                    console.log("err=", error);
                });

    }

    render() {
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <a
                href=""
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
            >
                {children}
              &#x25bc;
            </a>
        ));

        // forwardRef again here!
        // Dropdown needs access to the DOM of the Menu to measure it
        const CustomMenu = React.forwardRef(
            ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
                const [value, setValue] = useState('');

                return (
                    <div
                        ref={ref}
                        style={style}
                        className={className}
                        aria-labelledby={labeledBy}
                    >

                        <FormControl
                            autoFocus
                            className="mx-3 my-2 w-auto"
                            placeholder="Type to filter..."
                            onChange={(e) => setValue(e.target.value)}
                            value={value}
                        />
                        <ul className="list-unstyled">
                            {React.Children.toArray(children).filter(
                                (child) =>
                                    !value || child.props.children.toLowerCase().startsWith(value),
                            )}
                        </ul>
                    </div>
                );
            },
        );
        console.log(this.props.location.state.finalJson)
        return (
            <div>
                <Container>
                    <Row style={{ margin: 20 }}>
                        <Col style={{ margin: 20 }}>

                        </Col>

                    </Row>

                    <Row style={{ margin: 20 }}>
                        <Col sm="4">
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    <b>source</b>
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    {
                                        this.state.data.nodes.map((item, i) => {
                                            return (
                                                <Dropdown.Item onSelect={this.selectSource} eventKey={item.id} key={i}>{item.id} </Dropdown.Item>
                                            )
                                        })
                                    }

                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col sm="3">
                            <label htmlFor="basic-url">Selected source: </label>
                        </Col>
                        <Col sm="4">
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder={this.state.source}
                                    aria-label="source selected"
                                    aria-describedby="basic-addon2"
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row style={{ margin: 20 }}>
                        <Col sm="4" >
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components2">
                                    <b>target</b>
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    {
                                        this.state.data.nodes.map((item, i) => {
                                            return (
                                                <Dropdown.Item onSelect={this.selectTarget} eventKey={item.id} key={i}>{item.id} </Dropdown.Item>
                                            )
                                        })
                                    }

                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col sm="3">
                            <label htmlFor="basic-url">Selected target: </label>
                        </Col>
                        <Col sm="4">
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder={this.state.target}
                                    aria-label="source selected"
                                    aria-describedby="basic-addon2"
                                />

                            </InputGroup>
                        </Col>
                    </Row>
                    <Row style={{ margin: 20 }}>
                        <Col sm="12">
                            <Button style={{ margin: '.5rem', padding: '.5rem 1.8rem', fontSize: '1.2rem' }} onClick={this.findShortestPaths}>
                                find paths
                        </Button>
                        </Col>
                    </Row>
                    <Row style={{ margin: 20 }}>
                        <Col sm="3">
                            <label htmlFor="basic-url">Shortest path: </label>
                        </Col>
                        <Col sm="4">
                            <ListGroup variant="flush">
                                {
                                    this.state.dataForShort.map((item, i) => {
                                        return (
                                            <ListGroup.Item key={i} className='text-left' style={{ paddingBottom: '.25rem', paddingTop: '.25rem' }}>{item}</ListGroup.Item>
                                        )
                                    })
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row style={{ margin: 20 }}>
                        <Col style={{ margin: 20 }}>
                            <Button style={{ margin: '.5rem', padding: '.5rem 1.8rem', fontSize: '1.2rem' }} onClick={this.startGame}>
                                play
                        </Button>
                        </Col>

                    </Row>
                    <Row style={{ margin: 20 }}>

                        <Col style={{ margin: 20 }}>
                            <ListGroup variant="flush">
                                {                                   
                                    this.state.dataForGame[0].map((itemm, ii) => {
                                        return (
                                            <ListGroup.Item key={ii} className='text-left' style={{ paddingBottom: '.25rem', paddingTop: '.25rem' }}>{itemm}</ListGroup.Item>
                                        )
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col style={{ margin: 20 }}>
                            <ListGroup variant="flush">
                                {
                                    this.state.dataForGame[1].map((itemm, ii) => {
                                        return (
                                            <ListGroup.Item key={ii} className='text-left' style={{ paddingBottom: '.25rem', paddingTop: '.25rem' }}>{itemm}</ListGroup.Item>
                                        )
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col style={{ margin: 20 }}>
                            <ListGroup variant="flush">
                                {
                                    this.state.dataForGame[2].map((itemm, ii) => {
                                        return (
                                            <ListGroup.Item key={ii} className='text-left' style={{ paddingBottom: '.25rem', paddingTop: '.25rem' }}>{itemm}</ListGroup.Item>
                                        )
                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col style={{ margin: 20 }}>
                            <ListGroup variant="flush">
                                {
                                    this.state.dataForGame[3].map((itemm, ii) => {
                                        return (
                                            <ListGroup.Item key={ii} className='text-left' style={{ paddingBottom: '.25rem', paddingTop: '.25rem' }}>{itemm}</ListGroup.Item>
                                        )
                                    })
                                }
                            </ListGroup>
                        </Col>

                    </Row>
                </Container>
            </div>
        );
    }
}
export default withRouter(Game);
