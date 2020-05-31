import React, { Component } from 'react';
import { Card, ListGroup, CardDeck, InputGroup, FormControl, Button } from 'react-bootstrap';
import logo from '../images/logo2.png';


class Category extends Component {
  render() {
    return (
      <div>
        <Card style={{ width: '12rem', margin: '.3em' }}>
          <Card.Img variant="top" src={logo} style={{ width: '60%', margin: 'auto' }} />
          <Card.Body>
            <Card.Title>{this.props.data.Name.replace(/_/g, ' ')}</Card.Title>
            <Card.Text>
              This category has __ nodes and __ vertices
    </Card.Text>
            <Button onClick={this.props.getNetwork} variant="info">view network</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Category;