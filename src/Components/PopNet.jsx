import React, { Component } from "react";
import Popup from "reactjs-popup";
import '../css/Popup.css';
import { ForceGraph3D } from 'react-force-graph';



class PopNet extends Component {
  constructor(props) {
    super(props);
    //this.state = { openPop: false };
    //this.openModal = this.openModal.bind(this);
   // this.closeModal = this.closeModal.bind(this);
  }
  //openModal() {
  //  this.setState({ open: true });
 // }
 // closeModal() {
   // this.setState({ open: false });
  //}
//var isOpen = false
  render() {
    console.log(this.props.data)
    return(
      <div>
          <Popup
         open={this.props.isOpen}
         closeOnDocumentClick
         onClose={this.closeModal}
        >
          <div className="PopModal">
            <a className="close" onClick={()=>this.props.closeModal()}>
              &times;
            </a>
            <div className="header"> {this.props.category} network</div>
          <div className="content" style={{innerWidth:'1000', maxHeight: '800', width: '1000' }}>
            {" "}
      
  <ForceGraph3D
  graphData={this.props.data}
  nodeAutoColorBy="id"
  nodeRelSize={8}
  linkThreeObjectExtend={true}
  showNavInfo={false}
  linkWidth={2}
  linkColor="#333"
  refresh={true}
  backgroundColor="#fff"
  
/>

            
          </div>
          <div className="actions">
          
            <button
              className="PopButton"
              onClick={() => {
                console.log("modal closed ");
                this.props.closeModal();
              }}
            >
              close window
            </button>
          </div>
          </div>
        </Popup>
      
    </div>
    )
  }
}

export default PopNet;
