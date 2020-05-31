import React, { Component } from 'react';
import { Card, ListGroup, CardDeck, InputGroup, FormControl , Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class FoundDataInFile extends Component {

    constructor(props) {
        super(props)
      
        this.state = {
            btnTitle: 'remove all',
            btnVariant:'outline-danger',
            btnState: 'allChacked'
        }
        this.handleChange = this.handleChange.bind(this);

    }
    handleChange = (btn) => {
        let valTitle = '';
        let valColor = '';
        let valState = '';
        if(btn.target.value==='chacked'){
            valTitle = 'select all';
            valColor = 'outline-info';
            valState = 'allUnchacked';     
            btn.target.value = 'Unchacked';
       
        }
        else{
            valTitle = 'remove all';
            valColor = 'outline-danger';
            valState = 'allChacked';
            btn.target.value = 'chacked';
        }
        console.log(btn.target.value)
        this.setState({btnTitle: valTitle, btnVariant: valColor, btnState: valState} ,()=>{
            this.props.removeAll(this.state.btnState); 
        })

    }

    render() {

        return (
            <div>
                <Card>
                    <Card.Header>
                        <Card.Title >Network Details</Card.Title>
                        <Card.Subtitle className="text-left">
                            Subject:
                            </Card.Subtitle>
                        <Card.Text className="text-left">{this.props.details.subject}</Card.Text>
                        <Card.Subtitle className="text-left">
                            Description:
                            </Card.Subtitle>
                        <Card.Text className="text-left">{this.props.details.description}</Card.Text>
                    </Card.Header>
                    <Card.Body className="text-left">
                    <Card.Subtitle>
                            This is what we find in your JSON file :
                            </Card.Subtitle>
                            total of {this.props.details.rawData.length} nodes<br />
                        {this.props.data.length} keys pottential to be Id<br />
                        {this.props.connections.length} different connection types</Card.Body>
                </Card>
                <CardDeck className="ml-5 mr-5 pb-5 pt-5">
                    <Card style={{ width: '18rem' }}>
                        <Card.Header>
                            <Card.Title>Potential Id</Card.Title>
                            <Card.Subtitle>
                                we searched for a key that can use as identical id, and this is what we found:
                            </Card.Subtitle>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {
                                Object.values(this.props.data).map((item, i) => {
                                    return (
                                        <ListGroup.Item key={i} className='text-left' style={{paddingBottom: '.25rem', paddingTop: '.25rem'}}> <b>{item.k}</b> apears <b>{item.v.length}</b> times, ratio is: <b>{item.ratio}</b></ListGroup.Item>
                                    )
                                })
                            }
                        </ListGroup>
                    </Card>
                    <Card style={{ width: '18rem' }}>
                        <Card.Header>
                            <Card.Title>Connection Type</Card.Title>
                            <Card.Subtitle>
                                List of the connections we found are:
                            </Card.Subtitle>
                            <Card.Text>you can uncheck connection type and see what happend</Card.Text>
                        </Card.Header>
                        
                        {
                            this.props.connections.map((item, i) => {
                                return (
                                    <InputGroup key={i}>
                                        <InputGroup.Prepend>
                                            <InputGroup.Checkbox value={item.name} onChange={this.props.passedFunction} checked={item.isChecked} aria-label="Checkbox for following text input" />
                                        </InputGroup.Prepend>
                                        <FormControl placeholder={item.name + " " + item.conAmount + " times"} aria-label="Text input with checkbox" />
                                    </InputGroup>
                                )
                            })
                        }
                         <Button className="mx-auto my-2" variant={this.state.btnVariant} value="chacked" onClick={this.handleChange}>{this.state.btnTitle}</Button>

                    </Card>
                </CardDeck>
            </div>
        );
    }
}

export default withRouter(FoundDataInFile);
