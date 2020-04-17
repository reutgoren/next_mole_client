import React, { Component } from 'react';

class SingleNode extends Component {
    render() {
        console.log(this.props.nodeData)
        return (
            <div>
                id: {this.props.nodeData.id}
            </div>
        );
    }
}

export default SingleNode;