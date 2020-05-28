import React, { Component } from 'react';
import { Card, ListGroup, CardDeck, InputGroup, FormControl , Button} from 'react-bootstrap';
import logo from '../images/logo2.png';


class Category extends Component {
    render() {
        return (
            <div>
                <Card style={{ width: '12rem', margin: '.3em' }}>
  <Card.Img  variant="top" src={logo} style={{ width: '80%', margin: 'auto' }}/>
  <Card.Body>
    <Card.Title>{this.props.data.Name}</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">Go somewhere</Button>
  </Card.Body>
</Card>
            </div>
        );
    }
}

export default Category;