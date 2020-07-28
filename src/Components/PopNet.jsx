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
            <div className="header"> Modal Title </div>
          <div className="content">
            {" "}
            {
  <ForceGraph3D
  graphData={this.props.data}

  nodeRelSize={8}
  linkThreeObjectExtend={true}
  showNavInfo={false}
  linkWidth={2}
  refresh={true}
  scales={0.00001}
  nodeLabel="id"
  backgroundColor="rgb(164, 184, 204)"
/>

            }
            <br />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
            commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
            explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
          </div>
          <div className="actions">
          
            <button
              className="PopButton"
              onClick={() => {
                console.log("modal closed ");
                this.props.closeModal();
              }}
            >
              close modal
            </button>
          </div>
          </div>
        </Popup>
        {/*
    <Popup trigger={<button className="PopButton"> Open Modal </button>} modal>
      {close => (
        <div className="PopModal">
          <a className="close" onClick={close}>
            &times;
          </a>
          <div className="header"> Modal Title </div>
          <div className="content">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
            Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
            delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
            <br />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
            commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
            explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
          </div>
          <div className="actions">
            <Popup
              trigger={<button className="PopButton"> Trigger </button>}
              position="top center"
              closeOnDocumentClick
            >
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                magni omnis delectus nemo, maxime molestiae dolorem numquam
                mollitia, voluptate ea, accusamus excepturi deleniti ratione
                sapiente! Laudantium, aperiam doloribus. Odit, aut.
              </span>
            </Popup>
            <button
              className="PopButton"
              onClick={() => {
                console.log("modal closed ");
                close();
              }}
            >
              close modal
            </button>
          </div>
        </div>
      )}
    </Popup>
     */}
    </div>
    )
  }
}

export default PopNet;
