import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Dropdown, FormControl, Button } from 'react-bootstrap';
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
            target: ''

        }
    }

    selectSource=(s)=>{
        console.log('source: ', s);
        //console.log(this)
        this.setState({source: s})

    }

    selectTarget=(t)=>{
        console.log('target: ',t);
        this.setState({target: t})

    }

    startGame=()=>{
        console.log("inside play")
        let category = "Game_Of_Thrones";
        let api= this.apiUrl+"networkStartAGame?categoryNAME="+category;
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
              paths = result;
              this.showPaths();
            },
              (error) => {
                console.log("err=", error);
              });
    }
    showPaths=()=>{



    }

    findShortestPaths=()=>{
        console.log("inside find shortets paths")
        //let source = this.state.source;
        //let target = this.state.target;
        var source = "Aegon Targaryen";
        var target = "Sandor Clegane";
        let category = "Game_Of_Thrones";
        let api= this.apiUrl+"networkGetPath/?source="+source+"&target="+target+'&categoryNAME='+category;
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
                {/*
                    this.state.data.nodes.map(node=>{
                        return(
                            <div>
                                node: {node.id}
                            </div>
                        )
                    })

                     var source = "Aegon Targaryen";
                    var target = "Sandor Clegane";

                */ }
                <Container>
                    <Row className="mr-20">
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    source
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    {
                                        this.state.data.nodes.map((item,i)=>{
                                            return(
                                                <Dropdown.Item onSelect={this.selectSource} eventKey={item.id} key={i}>{item.id} </Dropdown.Item>
                                            )
                                        })
                                    }
                                    
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                         
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components2">
                                    target
                                </Dropdown.Toggle>

                                <Dropdown.Menu as={CustomMenu}>
                                    {
                                        this.state.data.nodes.map((item,i)=>{
                                            return(
                                                <Dropdown.Item onSelect={this.selectTarget} eventKey={item.id} key={i}>{item.id} </Dropdown.Item>
                                            )
                                        })
                                    }
                                    
                                </Dropdown.Menu>
                            </Dropdown>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Button style={{margin: '.5rem', padding: '.5rem 1.8rem', fontSize: '1.2rem'}} onClick={this.startGame}>
                            play
                        </Button>   
                    </Row>
                    <Row>              
                        <Button style={{margin: '.5rem', padding: '.5rem 1.8rem', fontSize: '1.2rem'}} onClick={this.findShortestPaths}>
                            find paths
                        </Button>
                    </Row>
                    <Row id="paths">
                        {
                            paths.map(arr=>{
                              
                                    return(
                                        <div>
                                              {
                                              arr.map(item=>{
                                                  return(
                                                      <p>
                                                          {item}
                                                      </p>
                                                  )
                                                   })
                                                }
                                        </div>
                                    )
                               
                            })
                        }

                    </Row>

                </Container>


            </div>
        );
    }
}
export default withRouter(Game);
