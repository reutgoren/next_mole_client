import React, { Component } from 'react';
//import Data from "../gotData.json";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
import FoundDataInFile from './FoundDataInFile';
import gotData from '../gotData.json'
//import { easeLinear } from 'd3';


//var finalJson = { nodes: [], links: [] };
var finalJsonNetwork = { nodes: [], links: [] }
var removedLinksTmp = [];      // save the connections that removed
var arrConnections = [];
var arrKeysAndRadio = [];
var dataFromLocal = [];
var rawData = [];
//const isImageUrl = require('is-image-url');
const isImage = require('is-image');
class Graph extends Component {
    constructor(props) {
        super(props)
        //let local = false;
        let local = true;
        this.apiUrl = 'https://localhost:44312/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
        }
        this.state = {
            //dataBefore: this.props.location.state.jsonDetails.rawData,
            finalJson: { nodes: [], links: [] },
            removedLinks: [],       // save the connections that removed
            connectionsAll: [],
            allNodes: []

        }
    }

    postJsonToDB = (file) => {                              // save nodes and links to DB
        const nodesList = file.nodes.map(item => {
            const { image, index, vx, vy, vz, x, y, z, color, __threeObj, ...withoutGraphParams } = item;         //  remove all graph parameters like vx, vy.....
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

        const nodesListAll = this.state.allNodes.map(item => {
            const { image, index, vx, vy, vz, x, y, z, color, __threeObj, ...withoutGraphParams } = item;         //  remove all graph parameters like vx, vy.....
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
        let str = this.props.location.state.jsonDetails.subject;
        console.log(str)
        var tableName = str.replace(/ /g, "_");
        console.log(tableName)


        fetch(this.apiUrl + 'nodes/' + tableName, {        //POST nodes with links
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


        fetch(this.apiUrl + 'nodesSaveAll/' + tableName, {        //POST nodes with / without links
            method: 'POST',
            body: JSON.stringify(nodesListAll),
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
        fetch(this.apiUrl + 'links/' + tableName, {              //POST links
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

    RemoveAllConnections = (btnState) => {
        console.log(btnState)
        removedLinksTmp = this.state.removedLinks;
        console.log(finalJsonNetwork.links)
        if (btnState === 'allUnchacked') {
            finalJsonNetwork.links.map(i => removedLinksTmp.push(i))
            finalJsonNetwork.links.splice(0);

            console.log('links remain: ', finalJsonNetwork.links)
            console.log('removed ', removedLinksTmp);
            arrConnections.map(o => {
                o.isChecked = false
            })
        }
        else {
            removedLinksTmp.map(i => finalJsonNetwork.links.push(i))
            removedLinksTmp.splice(0);
            console.log('links remain: ', finalJsonNetwork.links)
            console.log('removed ', removedLinksTmp);
            arrConnections.map(o => {
                o.isChecked = true
            })
        }

        this.setState({
            connectionsAll: arrConnections,
            finalJson: finalJsonNetwork,
            removedLinks: removedLinksTmp,
        })
    }

    RemoveConnection = (x) => {             // add / remove connection type   
        removedLinksTmp = this.state.removedLinks;
        console.log(removedLinksTmp, finalJsonNetwork)
        if (!x.target.checked) {         //  if connection removed        
            let pos = arrConnections.map(function (e) { return e.name; }).indexOf(x.target.value);
            arrConnections[pos].isChecked = false;
            this.setState({ connectionsAll: arrConnections })
            remove();

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
            let pos = arrConnections.map(function (e) { return e.name; }).indexOf(x.target.value);
            arrConnections[pos].isChecked = true;
            this.setState({ connectionsAll: arrConnections })
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
        console.log("removed: ", removedLinksTmp);
        console.log('finaljson: ', finalJsonNetwork)
        console.log(this.state.connectionsAll)
        this.setState({
            finalJson: finalJsonNetwork,
            removedLinks: removedLinksTmp
        });
        //this.forceUpdate();

    }

    componentDidMount() {
        arrKeysAndRadio = this.getKeys(rawData)
        console.log(arrKeysAndRadio)
        var id = this.getId(arrKeysAndRadio);
        if (id !== '') {
            this.getNodes(rawData, id);
            //this.getLinks(rawData, id, arrConnections);
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
        let total = 0;
        var arrOfKeysTmpCopy = arrOfKeysTmp;
        var arrCon = [];
        maxRatioObj.v.map((itemToSearch) => {
            var totalObjConnection = 0;
            arrOfKeysTmpCopy.map((searchInto) => {
                if (searchInto.k !== potentialId) {                      // sreach in all other keys beside the potential
                    var count = this.countAppearence(itemToSearch, searchInto.v);
                    if (count !== 0) {
                        arrCon.push(searchInto.k)    // build array of connection types, tmp

                    }
                    totalObjConnection += count;
                    total += count;
                }
            })

            if (totalObjConnection === 0) {
                //console.log(itemToSearch,' has no connections')
            }
            else {
                //console.log(itemToSearch, 'has ',totalObjConnection,' connections')
            }
        })
        if (total > maxRatioObj.v.length) {
            isId = true;
            console.log(potentialId + ' is the key that found uniqe')
        }
        arrConnections = this.getConnections(arrCon);
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

    getConnections = (arr) => {
        var arrConnectionType2 = [];
        var tmpArrConnectionType2 = Array.from(new Set(arr));           // remove duplicate connections
        for (let i = 0; i < tmpArrConnectionType2.length; i++) {                                   // create array of key value pair
            //let count= this.countAppearence(tmpArrConnectionType2[i],arr)
            let obj = {
                name: tmpArrConnectionType2[i],
                conAmount: 0,
                isChecked: true
            }
            arrConnectionType2.push(obj)
        }
        console.log(arrConnectionType2);
        return arrConnectionType2;
    }

    getNodes = (arr, id) => {
        var nodesToAdd = [];
        for (let item in arr) {
            let newNode = arr[item];                        //create new node
            newNode.id = arr[item][id];
            newNode.nodeImage = '';
            for (let key in arr[item]) {                // look for an image URL in the object
                if (typeof arr[item][key] === 'object') {
                    for (let k in arr[item][key]) {
                        var isImageString = isImage(arr[item][key][k]);
                        if (isImageString) {
                            newNode.nodeImage = arr[item][key][k]
                            break
                        }
                    }
                }
                else if (typeof arr[item][key] === 'string') {
                    var isImageString = isImage(arr[item][key]);
                    if (isImageString) {
                        newNode.nodeImage = arr[item][key]
                        break
                    }
                }
                else {
                    console.log(typeof arr[item][key])
                    break
                }
            }
            nodesToAdd.push(newNode);
        }
        finalJsonNetwork.nodes = nodesToAdd;
        console.log(finalJsonNetwork.nodes);
        this.setState({ finalJson: finalJsonNetwork }, () => { this.getLinks(rawData, id, arrConnections) })

    }

    getLinks = (arr, id, arrConnections) => {
        console.log('inside get links')
        console.log(this.state.finalJson)
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


        //  remove duplicate links
        var linksTmp = linksToAdd.filter((ele, ind) => ind === linksToAdd.findIndex(elem => elem.source === ele.source && elem.target === ele.target))

        //  remove nodes without links
        var originalArray2 = this.state.finalJson.nodes;
        var nodesWithLinks = [];
        var nodesWithoutLinks = [];
        var cnt = 0;
        var cntWithout = 0;
        var originalArray = Array.from(new Set(originalArray2));
        console.log(originalArray)
        for (let arr in originalArray) {
            var hasLink = false;
            for (let filter in linksTmp) {
                if (originalArray[arr].id === linksTmp[filter].target || originalArray[arr].id === linksTmp[filter].source) {
                    hasLink = true;
                }
            }
            if (hasLink) {
                cnt++;
                nodesWithLinks.push(originalArray[arr]);

            }

            else {
                cntWithout++;
                nodesWithoutLinks.push(originalArray[arr])

            }
        }

        // remove duplicates
        nodesWithLinks = nodesWithLinks.filter((ele, ind) => ind === nodesWithLinks.findIndex(elem => elem.id === ele.id && elem.id === ele.id))
        nodesWithoutLinks = nodesWithoutLinks.filter((ele, ind) => ind === nodesWithoutLinks.findIndex(elem => elem.id === ele.id && elem.id === ele.id))
        originalArray = originalArray.filter((ele, ind) => ind === originalArray.findIndex(elem => elem.id === ele.id && elem.id === ele.id))

        console.log('with', cnt)
        console.log('without', cntWithout)
        console.log('original ', originalArray)
        console.log('nodesWithLinks ', nodesWithLinks)
        console.log('nodesWithoutLinks ', nodesWithoutLinks)


        //count total connection type amount
        linksTmp.map(i => {
            let pos = arrConnections.map(function (e) { return e.name; }).indexOf(i.connectionType);
            let count = arrConnections[pos].conAmount;
            count++;
            arrConnections[pos].conAmount = count;
        })

        arrConnections.sort(function (a, b) {           //    sort connection types by amount of appearence
            return b.conAmount - a.conAmount;
        });


        finalJsonNetwork.links = linksTmp;
        finalJsonNetwork.nodes = nodesWithLinks;
        console.log(finalJsonNetwork)
        console.log(arrConnections)
        //this.forceUpdate();
        this.setState({
            finalJson: finalJsonNetwork,
            connectionsAll: arrConnections,
            allNodes: originalArray
        })

    }

    goToGame = () => {
        console.log("inside game")
        var dataToPass = this.state.finalJson;
        //var nodesData = this.state.allNodes;
        this.props.history.push({
            pathname: '/game',
            state: {
                finalJson: dataToPass,
 
            }
        });

    }

    render() {
        if (localStorage.getItem('jsonRowData')) {
            rawData = JSON.parse(localStorage.getItem('jsonRowData'));
        }
        else {
            rawData = this.props.location.state.jsonDetails.rawData;
        }
        if (localStorage.getItem('jsonDetails')) {
            dataFromLocal = JSON.parse(localStorage.getItem('jsonDetails'));
        }
        else {
            dataFromLocal = this.props.location.state.jsonDetails.rawData
        }
        //rawData= this.props.location.state.jsonDetails.rawData;

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
                            <Button style={{ padding: '1.175rem 0.75rem', fontSize: '1.1rem', marginBottom: '2rem' }} variant="btn btn-info " onClick={() => this.postJsonToDB(finalJsonNetwork)}>Save network to DB</Button>
                        </Col>
                    </Row>
                    <Row className="overflow-hidden">

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
                            refresh={true}
                        />

                    </Row>
                    <Row>
                        <Col>
                            <Button style={{ padding: '1.175rem 0.75rem', fontSize: '1.1rem', marginBottom: '2rem' }} variant="btn btn-info" onClick={this.goToGame}>Start "play"</Button>
                        </Col>
                    </Row>
                </Container>
            </div >
        )
    }
}

export default withRouter(Graph); 