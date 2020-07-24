import React, { Component } from 'react';
import { Card, ListGroup, CardDeck, InputGroup, FormControl, Button } from 'react-bootstrap';
import logo from '../images/logo2.png';


class Category extends Component {
  render() {
    console.log(this.props.data)
    return (
      <div>
        <Card style={{ width: '12rem', margin: '.3em' }}>
          <Card.Img variant="top" src={logo} style={{ width: '60%', margin: 'auto' }} />
          <Card.Body>
            <Card.Title>{this.props.data.Name.replace(/_/g, ' ')}</Card.Title>
            <Card.Text>
              This category has {this.props.data.VerteciesInCat} nodes and {this.props.data.EdgesInCat} vertices
    </Card.Text>
            <Button className='button' onClick={()=>this.props.getNetwork(this.props.data.Name)} variant="info">view network</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Category;