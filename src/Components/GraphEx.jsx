import React, { Component } from 'react';
//import Data from "../gotData.json";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
import FoundDataInFile from './FoundDataInFile';
import gotData from '../gotData.json'
import { easeLinear } from 'd3';


//var finalJson = { nodes: [], links: [] };
var finalJsonNetwork = { nodes: [], links: [] }
var removedLinksTmp = [] ;      // save the connections that removed
var arrConnections =[];
var arrKeysAndRadio=[];
var dataFromLocal=[];
var rawData=[];
//const isImageUrl = require('is-image-url');
const isImage = require('is-image');
class GraphEx extends Component {
    constructor(props) {
        super(props)
        //let local = false;
        let local = true;
        this.apiUrl = 'https://localhost:44312/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
        }
        this.state = {
            dataBefore: this.props.location.state.jsonDetails.rawData,
            finalJson: { nodes: [], links: [] },
            removedLinks: [],       // save the connections that removed
            isAllChecked:true,
            connectionsAll:'',

        }
    }

    postJsonToDB = (file) => {                              // save nodes and links to DB
        const nodesList = file.nodes.map(item => {
            const {image, index, vx, vy, vz, x, y, z,color,__threeObj, ...withoutGraphParams } = item;         //  remove all graph parameters like vx, vy.....
            let str = JSON.stringify(withoutGraphParams)
            let strW = str.replace(/'/g, "").replace(/"|{|}/g, "");
            let id = item.id;
            let idW = id.replace(/'/g, "");
            var singleNode = {
                NodeNum: idW,
                NodeImageURL: item.nodeImage,
                NodeDescription: strW
            }
            return singleNode;
        })

        const linksList = file.links.map(item => {
            let sour = item.source.id;
            let sourW = sour.replace(/'/g, "");
            let targ = item.target.id;
            let targW = targ.replace(/'/g, "");
            var singleLink = {
                SourceNode: sourW,
                TargetNode: targW,
                ConnectionType: item.connectionType,
                ConnectionWeight: 1

            }
            return singleLink;
        })
        console.log(linksList);
        console.log(this.props.location.state.jsonDetails);
        let str= this.props.location.state.jsonDetails.subject;
        console.log(str)
        var tableName = str.replace(/ /g,"_");
        console.log(tableName)
        fetch(this.apiUrl + 'nodes/'+tableName, {        //POST nodes
            method: 'POST',
            body: JSON.stringify(nodesList),
            //mode: 'no-cors',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                },
                (error) => {
                    console.log("err post=", error);
                });

        fetch(this.apiUrl + 'links/'+tableName, {              //POST links
            method: 'POST',
            body: JSON.stringify(linksList),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    RemoveAllConnections=()=>{
        removedLinksTmp = this.state.removedLinks;
        console.log(finalJsonNetwork.links)
        finalJsonNetwork.links.map(i=>removedLinksTmp.push(i))
        //removedLinks.push(finalJsonNetwork.links[j]);

        finalJsonNetwork.links.splice(0);
       
        console.log(finalJsonNetwork.links)
        console.log('removed ',removedLinksTmp);

        this.setState({
            finalJson: finalJsonNetwork,
            removedLinks: removedLinksTmp,
            isAllChecked: false
        })
    }

    RemoveConnection = (x) => {             // add / remove connection type   
        removedLinksTmp = this.state.removedLinks;
        console.log(removedLinksTmp, finalJsonNetwork)
        if (!x.target.checked) {         //  if connection removed
            remove();
            console.log(arrConnections)
            //arrConnections.map(i=>)
            this.setState({
              //  con
            })

            function remove() {
                for (let j in finalJsonNetwork.links) {
                    if (finalJsonNetwork.links[j].connectionType === x.target.value) {
                        removedLinksTmp.push(finalJsonNetwork.links[j]);
                        finalJsonNetwork.links.splice(j, 1);
                    }
                }
                let count = 0;
                for (let k in finalJsonNetwork.links) {
                    if (finalJsonNetwork.links[k].connectionType === x.target.value) {
                        count++
                    };
                    if (count > 0) {
                        remove();
                    }
                }
            }
        }
        else {
            funclear();
            function funclear() {
                for (let k in removedLinksTmp) {
                    if (removedLinksTmp[k].connectionType === x.target.value) {
                        finalJsonNetwork.links.push(removedLinksTmp[k]);
                        removedLinksTmp.splice(k, 1);
                    }
                }
                let temp = 0;
                for (let l in removedLinksTmp) {
                    if (removedLinksTmp[l].connectionType === x.target.value) {
                        temp++;
                    };
                    if (temp > 0) {
                        funclear();
                    }
                }
            }
        }
        console.log(removedLinksTmp, finalJsonNetwork);
        this.setState({
            finalJson:finalJsonNetwork, 
            removedLinks: removedLinksTmp});
        //this.forceUpdate();

    }

     componentDidMount() {
        arrKeysAndRadio = this.getKeys(rawData)
        console.log(arrKeysAndRadio)
        var id= this.getId(arrKeysAndRadio);
        if(id!==''){
            this.getNodes(rawData, id);
            this.getLinks(rawData, id, arrConnections);
        }
    }

    getKeys = (rawArr) => {
        let totalObj = rawArr.length;                 // total amount of object in original array
        let arrAllKeys = [];                      // all keys including duplicates
        Object.keys(rawArr).forEach(function (k) {
            const values = Object.keys(rawArr[k])
            values.map((i) => {
                arrAllKeys.push(i)
            });
        });
        let arrDistinctKeys = Array.from(new Set(arrAllKeys));       // remove duplicates
        var keysAndValues = this.countKeyRatio(arrDistinctKeys, arrAllKeys, totalObj)             // get ratio for key
        return keysAndValues
    }

    countKeyRatio = (arrDistinct, arrAll, totalObjCount) => {
        const arrKeysAndRadio2 = [];
        arrDistinct.map((i) => {
            var search = i;
            var countKey = arrAll.reduce(function (n, val) {        // counts total amount of key appearence in the array
                return n + (val === search);
            }, 0);
            let objValuesTmp = this.addValues(i);
            let objValues = Array.from(new Set(objValuesTmp));      // remove duplicates values
            let keyRatio = parseFloat((objValues.length / totalObjCount).toFixed(3));                 
            let obj = {
                k: i, v: objValues, amount: countKey, ratio: keyRatio
            }
            arrKeysAndRadio2.push(obj)

        });
        arrKeysAndRadio2.sort(function (a, b) {           //    sort keys by ratio
            return b.ratio - a.ratio;
        });
        return arrKeysAndRadio2
    }

    addValues = (index) => {          // get all values for key 
        var val = [];
        var arrTmp = rawData;
        for (let g in arrTmp) {
            if (arrTmp[g][index]) {                     //אם בכלל קיים שדה כזה
                let type = typeof (arrTmp[g][index])
                if (type === 'object') {
                    arrTmp[g][index].map(item => {
                        val.push(item)
                    })
                }
                else {
                    val.push(arrTmp[g][index])
                }
            }
        }
        return val;
    }

    getId = (arrOfKeys) => {
        let isId = false;
        var arrOfKeysTmp = arrOfKeys;
        var maxRatioObj = arrOfKeysTmp.reduce((prev, current) => (prev.ratio > current.ratio) ? prev : current);  // get the object with maximun ratio
        var maxRatioIndex = arrOfKeys.findIndex(o => o.ratio === maxRatioObj.ratio);     // find the object index 
        let potentialId = maxRatioObj.k;            // potential key to be id
        let total=0;
        var arrOfKeysTmpCopy = arrOfKeysTmp;
        var arrCon=[];
        maxRatioObj.v.map((itemToSearch) => {     
            var totalObjConnection=0;
            arrOfKeysTmpCopy.map((searchInto) => {
                if (searchInto.k !== potentialId) {                      // sreach in all other keys beside the potential
                    var count=this.countAppearence(itemToSearch, searchInto.v);
                    if(count!==0){                          
                            arrCon.push(searchInto.k)    // build array of connection types, tmp
                        
                    }
                    totalObjConnection+=count;
                    total+=count;             
                }
            })

            if(totalObjConnection===0){
               //console.log(itemToSearch,' has no connections')
            }
            else{
                //console.log(itemToSearch, 'has ',totalObjConnection,' connections')
            }
        })
        if(total>maxRatioObj.v.length){
            isId=true;
            console.log(potentialId+' is the key that found uniqe')
        }
        arrConnections= this.getConnections(arrCon);
        this.setState({
            connectionsAll: arrConnections
        })
        return potentialId
    }

    countAppearence = (item, arr) => {
        var count = arr.reduce(function (n, val) {
            return n + (val === item);
        }, 0);
        return count
    }

     getConnections=(arr)=>{
        var arrConnectionType2 = [];
        var tmpArrConnectionType2 = Array.from(new Set(arr));           // remove duplicate
        for (let i = 0; i < tmpArrConnectionType2.length; i++) {                                   // create array of key value pair
            //let count= this.countAppearence(tmpArrConnectionType2[i],arr)
            let obj = {
                name: tmpArrConnectionType2[i],
                amount: 0,
                isaChecked: true
            }
            arrConnectionType2.push(obj)
        }
        console.log(arrConnectionType2);
        return arrConnectionType2;
     }

     getNodes=(arr, id)=>{
        var nodesToAdd = [];
        for (let item in arr) {
            let newNode = arr[item];                        //create new node
            newNode.id = arr[item][id];
            newNode.nodeImage = '';
            for (let key in arr[item]) {                // look for an image URL in the object
                if (typeof arr[item][key]==='object') {
                    for(let k in arr[item][key]){
                        var isImageString = isImage(arr[item][key][k]);
                        if(isImageString){
                            newNode.nodeImage = arr[item][key][k]
                            break
                        }
                    }                  
                }
                else if(typeof arr[item][key]==='string' ){
                    var isImageString = isImage(arr[item][key]);
                    if(isImageString){
                        newNode.nodeImage = arr[item][key]
                        break
                    }
                }
                else{
                    console.log(typeof arr[item][key])
                    break
                }               
             }
            nodesToAdd.push(newNode);
        }     
        finalJsonNetwork.nodes=nodesToAdd;
        console.log(finalJsonNetwork.nodes);
        this.setState({finalJson: finalJsonNetwork})
     }

     getLinks=(arr, id , arrConnections)=>{
            var linksToAdd = [];
            var tmpArr = arr;                      // search links in the original array, every loop we dismiss the current
           
            for (let item in tmpArr) {
                var searchedItem = tmpArr[item][id];
                let itemToAddBack = tmpArr[item];
                var withoutCorrent = tmpArr;
                withoutCorrent.splice(item, 1);          // dismiss the current
                for (let i in withoutCorrent) {
                    for (let key in withoutCorrent[i]) {
                        if (key !== id && key !== 'id') {                   // search all keys bedise 'id', beacuse it key we added
                            if (typeof withoutCorrent[i][key] === 'object') {
                                for (let j = 0; j < withoutCorrent[i][key].length; j++) {
                                    if (searchedItem === withoutCorrent[i][key][j]) {
                                        let newLink = { target: withoutCorrent[i][id], source: searchedItem, connectionType: key }
                                        linksToAdd.push(newLink)                //create new link
                                        for (let i in arrConnections) {
                                            if (arrConnections[i].name === key) {
                                                let tmpAmount = arrConnections[i].amount;       // count amount of connection type
                                                tmpAmount++;
                                                arrConnections[i].amount = tmpAmount;
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                if (searchedItem === withoutCorrent[i][key]) {
                                    let newLink = { source: withoutCorrent[i][id], target: searchedItem, connectionType: key }
                                    linksToAdd.push(newLink);

                                }
                            }
                        }
                    }
                }
                withoutCorrent.splice(item, 0, itemToAddBack)         // return back the current
                tmpArr = withoutCorrent;
            }
            arrConnections.sort(function (a, b) {           //    sort connection types by amount of appearence
                return b.amount - a.amount;
            });
            finalJsonNetwork.links= linksToAdd;
            console.log(finalJsonNetwork)
            //this.forceUpdate();
            this.setState({finalJson: finalJsonNetwork})

     }

    render() {
        if(localStorage.getItem('jsonRowData')){
            rawData = JSON.parse(localStorage.getItem('jsonRowData'));         
       }
       else{
        rawData = this.props.location.state.jsonDetails.rawData;
       }
       if(localStorage.getItem('jsonDetails')){
        dataFromLocal = JSON.parse(localStorage.getItem('jsonDetails'));    
        }
        else{
         dataFromLocal = this.props.location.state.jsonDetails.rawData
         }
        //rawData= this.props.location.state.jsonDetails.rawData;
        console.log(rawData)
        console.log(this.state.dataBefore)

        console.log('render', this.state.finalJson)

        return (
            <div>
                <Container>
                    <Row><br /></Row>
                    <Row><br /></Row>
                    <Row>
                        <Col xs={12}>
                            <FoundDataInFile removeAll={this.RemoveAllConnections} passedFunction={this.RemoveConnection} data={arrKeysAndRadio} details={dataFromLocal} connections={arrConnections} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="btn btn-info " onClick={() => this.postJsonToDB(finalJsonNetwork)}>Save network to DB</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <ForceGraph3D
                                graphData={this.state.finalJson}
                                nodeLabel="id"
                                linkLabel="connectionType"
                                nodeAutoColorBy="id"
                                nodeRelSize={8}
                                linkThreeObjectExtend={true}
                                showNavInfo={false}
                                backgroundColor="rgb(164, 184, 204)"
                                linkWidth={2}
                            />
                        </Col>
                    </Row>
                </Container>
            </div >
        )
    }
}

export default withRouter(GraphEx); 