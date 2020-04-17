import React, { Component } from 'react';
import { Card, ListGroup, CardDeck, InputGroup, FormControl, Col } from 'react-bootstrap';


class FoundDataInFile extends Component {
    render() {
        //console.log(this.props.data)
        return (
            <div>
              
                <CardDeck className="ml-5 mr-5 pb-5 pt-5">
                    <Card>

                        <Card.Header>                            <Card.Title>Potential Id</Card.Title>
                            <Card.Subtitle>
                                we searched for a key that can use as identical id, and this is what we found:
    </Card.Subtitle>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {
                                Object.values(this.props.data).map((item, i) => {
                                    return (
                                        <ListGroup.Item key={i} className='text-left'> <b>{item.k}</b> apears <b>{item.v.length}</b> times, ratio is: <b>{item.ratio}</b></ListGroup.Item>
                                    )
                                })}

                            {/*
                            {this.props.data.map((i) => {
                                return (
                                    <ListGroup.Item>{i.k} apears {i.v} times, ratio is: {i.ratio}</ListGroup.Item>
                                )
                            })}
                        */}
                        </ListGroup>

                    </Card>
                    <Card>
                        <Card.Header>                            <Card.Title>Connection Type</Card.Title>
                            <Card.Subtitle>
                                List of the connections we found are:
    </Card.Subtitle>
                            <Card.Text>you can uncheck by choise</Card.Text>
                        </Card.Header>
                        
                        {this.props.connections.map((item, i) => {
                            return (
                                <InputGroup key={i}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Checkbox defaultChecked={true} aria-label="Checkbox for following text input" />
                                    </InputGroup.Prepend>
                                    <FormControl placeholder={item.name+" "+item.amount+" times"} aria-label="Text input with checkbox" />
                                </InputGroup>
                            )
                        })}
                    
                    </Card>

                </CardDeck>
            </div>
        );
    }
}

export default FoundDataInFile;