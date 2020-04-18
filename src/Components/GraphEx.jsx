import React, { Component } from 'react';
import { Graph } from "react-d3-graph";
import Data from "../gotData.json";
//import { Dropdown, Container, Col, Row } from 'react-bootstrap';
import { Button , Container, Row, Col} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
//import ForceGraph3D from '3d-force-graph';
import SpriteText from '3d-force-graph';
import { ForceGraph2D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import * as THREE from 'three';
import NewData from '../NewData.json';
import FoundDataInFile from './FoundDataInFile';
import SingleNode from './SingleNode';
//import PropTypes from 'prop-types';

//import { json, keys } from 'd3';
// graph payload (with minimalist structure)
const data = {
    nodes: [{ id: "Harry" , hobbey: 'football', "characterName": "Addam Marbrand",
    "characterLink": "/character/ch0305333/",
    "actorName": "B.J. Hogg",
    "actorLink": "/name/nm0389698/"}, 
    { id: "Sally", hobbey: 'ballet', "characterName": "Addam Marbrand",
    "characterName": "Aegon Targaryen",
    "houseName": "Targaryen",
    "royal": true,
    "parents": [
        "Elia Martell",
        "Rhaegar Targaryen"
    ],
    "siblings": [
        "Rhaenys Targaryen",
        "Jon Snow"
    ],
    "killedBy": [
        "Gregor Clegane"
    ]}, 
    { id: "Alice", hobbey: 'dancing', "characterName": "Addam Marbrand",
    "characterLink": "/character/ch0305333/",
    "actorName": "B.J. Hogg",
    "actorLink": "/name/nm0389698/" }, { id: 'Reut', hobbey: 'singing', "characterName": "Addam Marbrand",
    "characterLink": "/character/ch0305333/",
    "actorName": "B.J. Hogg",
    "actorLink": "/name/nm0389698/" }, { id: 'Gal' , hobbey: 'basketball', "characterName": "Addam Marbrand",
    "characterLink": "/character/ch0305333/",
    "actorName": "B.J. Hogg",
    "actorLink": "/name/nm0389698/"}],
    links: [{ source: "Harry", target: "Sally" }, { source: "Harry", target: "Alice" }, { source: "Reut", target: "Sally" }, { source: "Reut", target: "Gal" }, { source: "Reut", target: "Harry" }],
};
const data__ = {
    nodes: [],
    links: [],
};
const myConfig = {

    nodeHighlightBehavior: true,
    node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
    },
    link: {
        highlightColor: "lightblue",
    },
};

// graph event callbacks
/*

const onClickGraph = function () {
    window.alert(`Clicked the graph background`);
};

const onClickNode = function (nodeId) {
    window.alert(`Clicked node ${nodeId}`);
};

const onDoubleClickNode = function (nodeId) {
    window.alert(`Double clicked node ${nodeId}`);
};

const onRightClickNode = function (event, nodeId) {
    window.alert(`Right clicked node ${nodeId}`);
};

const onMouseOverNode = function (nodeId) {
    console.log(`Mouse over node ${nodeId}`);

};

const onMouseOutNode = function (nodeId) {
    console.log(`Mouse out node ${nodeId}`);

};

const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
};

const onRightClickLink = function (event, source, target) {
    window.alert(`Right clicked link between ${source} and ${target}`);
};

const onMouseOverLink = function (source, target) {
    console.log(`Mouse over in link between ${source} and ${target}`);

};

const onMouseOutLink = function (source, target) {
    console.log(`Mouse out link between ${source} and ${target}`);

};

const onNodePositionChange = function (nodeId, x, y) {
    window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
};
*/

/*
var arr = []
var arr2 = []
var arr_temp_for_field = []
var tot_items_in_array = 0;                        //מציאת כל השדות מכל האובייקטים
Object.keys(Data).forEach(function (k, i) {
    tot_items_in_array++;
    const values = Object.keys(Data[k])
    values.map((i) => {
        arr_temp_for_field.push(i)
    });
});

*/
//const arrId= arrField.filter()
//const apiUrl = 'http://localhost:44361/api/';
var finalJson = { nodes: [], links: [] }
var removedLinks = [] // הגדרת מערך ששומר את הקשרים שהוסרו

class GraphEx extends Component {
    constructor(props) {
        super(props)
        let local = false;
        //this.apiUrl = 'http://localhost:44361/api/';
        //if (!local) {
        //this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/proj/api/';
        // }

        this.state = {
            Relationship: "",
            ItemId: "",
            titleID: "Selected ID Parameter",
            titleRelationship: "Choose Connection Type",
            NumOfrecord: 0,
            graphData: data,
            finalFile: '',
            r: [],
            idFoundOnJson: '',
            //jsonData: this.props.location.state.jsonData
        }
    }
    IDfunction = (item) => {
        this.setState({
            ItemId: item.target.value
        })
    }

    RelationshipFunc = (item) => {
        console.log(item.target.value);
        this.setState({
            Relationship: item.target.value
        })
    }
    /*
        titleChange = (item) => {
            var a = [];
            this.setState({
                titleID: this.state.ItemId
            })
            var number = 0
            Object.keys(Data).forEach(function (k, i) {         //מציאת כמו האיברים במערך
                number += 1
            });
            this.state.NumOfrecord = number - 1;        //לא אמור לעבוד
            let temp = this.state.ItemId;
            Object.keys(Data).forEach(function (k, i) {
                const values = Object.keys(Data[k])
                values.map((i) => {
                    if (temp === i) {
                        a.push(Data[k][i])
                    }
                });
            });
            const uniqueNames = a.filter((val, id, array) => {
                return array.indexOf(val) == id;
            });
            console.log(uniqueNames)
            const doubleValue = uniqueNames.map((number) => {
                data__.nodes.push({ "id": number })
            });
            console.log(data__)
        }
    
    titleChange2 = (item) => {
        this.setState({
            titleRelationship: this.state.Relationship
        })
        let connection = this.state.Relationship;
        let key = this.state.ItemId
        console.log(connection);
        Object.keys(Data).forEach(function (k) {
            const values = Object.keys(Data[k])
            values.map((i) => {
                if (connection === i) {
                    const v = Object.keys(Data[k][i])
                    v.map((r, z) => {
                        console.log(Data[k][i][z])
                        console.log(Data[k][key])
                        data__.links.push({ "source": Data[k][key], "target": Data[k][i][z] })
                    });
                    
                }
            });
        });
        this.setState({
            graphData: data__
        })
        console.log(data__);
    }
    */

    saveToDB = () => {
        this.setState({
            titleRelationship: this.state.Relationship
        })
        let connection = this.state.Relationship;
        let key = this.state.ItemId
        console.log(connection);
        Object.keys(Data).forEach(function (k, i) {
            const values = Object.keys(Data[k])
            values.map((i) => {
                if (connection === i) {
                    const v = Object.keys(Data[k][i])
                    v.map((z) => {
                        console.log(Data[k][i][z])
                        console.log(Data[k][key])
                        data__.links.push({ "source": Data[k][key], "target": Data[k][i][z] })
                    });
                }
            });
        });
        this.setState({
            graphData: data__
        })
        console.log(data__);
    }

    postJsonToDB=(file) => {
       
        var api= 'https://localhost:44312/api/nodes';
        //var api= 'http://localhost:44312/api/node';
        console.log(file);
        /*const nodeToPost = {
           // NodeNum: 'aljdfn'
           nodes: file.nodes.map(item => {
                var objNode = {
                    NodeNum: item.id
                    //NodeDescription: JSON.stringify(item)
                }
                return objNode;
            })
            
        };
        */
        const nodesList= file.nodes.map(item=>{
            let str= JSON.stringify(item)
            let strW= str.replace(/'/g, "");
            let id= item.id;
            let idW= id.replace(/'/g, "");
            var singleNode={
                NodeNum: idW,
                NodeDescription: strW
            }
            return singleNode;
        })
        //nodesList.splice(0,380)
        //nodesList.forEach(element => {
          //  element.NodeDescription.replace('{', '');
        //});

        //const response = await fetch('https://localhost:44312/api/node/3');
        //const res = await response.json();
        //console.log(res);

        fetch(api , {
            method: 'POST',
            body: JSON.stringify(nodesList),
            //mode: 'no-cors',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
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

    RemoveConnection = (x) => {
        console.log(removedLinks, finalJson)
        if (!x.target.checked) {         //במידה והקשר הוסר 
            remove();
            function remove() {
                for (let j in finalJson.links) {
                    if (finalJson.links[j].connectionType === x.target.value) {
                        removedLinks.push(finalJson.links[j]);
                        finalJson.links.splice(j, 1);
                    }
                }
                let count = 0;
                for (let k in finalJson.links) {
                    if (finalJson.links[k].connectionType === x.target.value) {
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
                for (let k in removedLinks) {
                    if (removedLinks[k].connectionType === x.target.value) {
                        finalJson.links.push(removedLinks[k]);
                        removedLinks.splice(k, 1);
                    }
                }
                let temp = 0;
                for (let l in removedLinks) {
                    if (removedLinks[l].connectionType === x.target.value) {
                        temp++;
                    };
                    if (temp > 0) {
                        funclear();
                    }
                }
            }
        }
        console.log(removedLinks, finalJson)
    }

    render() {

        // console.log(this.props.location.state.jsonData)
        //const jsonData = this.props.location.state.jsonData;
        const jsonData = Data;
        var arr_temp_for_field = [];
        var arr_length = 0;
        var arr_of_25_and_values = [];
        const ratio = [];

        //מציאת מפתחות
        /*
        arr_fields= jsonData.map((item)=>{
            Object.keys(jsonData[item])
        })
        arr_fields.push(Object.keys(jsonData));
        console.log('keys '+arr_fields);
 //מציאת ערכים
 arr_values.push(Object.values(jsonData));
 console.log('values '+arr_values);

    */
        Object.keys(jsonData).forEach(function (k) {
            arr_length++;
            const values = Object.keys(jsonData[k])
            values.map((i) => {
                arr_temp_for_field.push(i)
            });
        });

        const arrField = Array.from(new Set(arr_temp_for_field));        //ניקוי שדות כפולים  

        arrField.map((i) => {
            var countRatio = 0
            var obj = {
                k: i, v: []
            }

            arr_of_25_and_values.push(obj);
            arr_temp_for_field.map((z) => {
                if (i === z) {
                    countRatio++;
                }
                //console.log(z);         
            })
            ratio.push(countRatio);
        });

        //console.log(ratio);
        let str = "";
        jsonData.map((i, m) => {
            const values = Object.keys(jsonData[m])
            values.map((x, c) => {
                // console.log(Data[m][x],values[c])
                str += values[c].toString() + "*****" + Data[m][x].toString() + "*****";
            })

        })
        //  console.log(str);
        var test = str.split("*****");

        var count = 0;
        var t = []
        test.map((i, z) => {
            count++;
            if (count % 2 === 1) {
                t.push(test[z] + "****" + test[z + 1]);
            }
        })
        //console.log(t);
        const arrClean = Array.from(new Set(t));            //מערך לאחר ניקוי ערכים כפולים
        //console.log(arrClean);
        let s = ""
        arrClean.map((i) => {
            s += "****" + i
        })
        //console.log(s);                 //כל המחרוזת עם כל המפתחות והשדות עם **** ביניהם
        const v = s.split("****");          //המרה לצורת מערך.... אבללל איפה משתמשים בו בכלל
        //console.log(v);

        jsonData.map((a, v) =>                 //מה עושה הקוד..??????
            arrField.map((l) => {
                const z = Object.keys(jsonData[v])
                //console.log(z);
                z.map((u) => {
                    if (u === l) {   //שניהם שדות כמו צ'ארקטר ניים
                        //combine.push(z,z)
                        //combine.push({l},{u})
                        //arrtemp[u].push(a[u]);
                        //tempArr.push(u,a[u])                      
                    }
                })
            })
        )

        var arr = []
        for (let i = 0; i < arrField.length; i++) {
            var y = {
                k: arrField[i], v: []
            }
            arr.push(y)
        }
        //  console.log(arr);
        for (let r in Data) {
            for (let j in arr) {
                //  console.log(arr[j])
                for (let u in arr[j]) {
                    if (typeof Data[r][arr[j][u]] === "object") {
                        //    console.log(typeof Data[r][arr[j][u]],Data[r][arr[j][u]]);
                        for (let z in Data[r][arr[j][u]]) {
                            // console.log(Data[r][arr[j][u]][z])
                            arr[j].v.push(Data[r][arr[j][u]][z]);
                        }
                    }
                    else {
                        if (typeof Data[r][arr[j][u]] !== "undefined") {
                            // console.log(typeof Data[r][arr[j][u]],Data[r][arr[j][u]]);
                            arr[j].v.push(Data[r][arr[j][u]])
                        }
                    }
                }
            }
        }
        // מערך של כל המפתחות והערכים כולל כפולים console.log(arr);
        var arrKeysAndRadio = [];
        for (let t in arr) {
            // console.log(arr[t].v);
            var TemparrremoveDuplicate = Array.from(new Set(arr[t].v));
            let objToAdd = {
                k: arr[t].k, v: TemparrremoveDuplicate
            }
            arrKeysAndRadio.push(objToAdd)
        }
        //  console.log(arrKeysAndRadio) //מערך שמכיל את כל המפתחות כאשר אין ערכים כפולים


        var index = Data.length  // כמה רשמות יש לנו ב JSON

        for (let z in arrKeysAndRadio) { // הוספת ערך יחסי של כל מפתח
            // console.log(arrKeysAndRadio[z].v.length/index);
            let calcRatio = (arrKeysAndRadio[z].v.length / index).toFixed(3);
            // console.log(calcRatio);
            arrKeysAndRadio[z]["ratio"] = parseFloat(calcRatio)
            //parseFloat(arrKeysAndRadio[z].v.length/index);
        }

        arrKeysAndRadio.sort(function (a, b) {           //מיון החלק היחסי של כל אחד
            return b.ratio - a.ratio;
        });
        const arrMultiConnectionType = [];
        var finalId = '';
        for (let i in arrKeysAndRadio) {          //ווידוא שהשדה איידי אכן יכול לשמש באיידי
            if (i === '0') {                                           //ומציאת סוגי קשרים פוטנציאלים
                var testt = arrKeysAndRadio[i];
            }
            //console.log(testt);
            //console.log(arrKeysAndRadio)
            for (let z in arrKeysAndRadio) {
                if (z !== '0') {
                    for (let j in testt.v) {
                        //console.log( testt.v[j])
                        for (let u in arrKeysAndRadio[z].v) {
                            if (arrKeysAndRadio[z].v[u] === testt.v[j]) {
                                //console.log(testt.v[j],testt.k,arrRemoveDuplicate[z].k);
                                arrMultiConnectionType.push(arrKeysAndRadio[z].k);
                                //finalId = test.k;
                                if (finalId !== testt.k) {
                                    finalId = testt.k;
                                }

                                // this.setState({
                                //   idFromJson: test.k
                                //})
                                //   arrt[arrRemoveDuplicate[z].k].push(arrRemoveDuplicate[z].v[u])
                            };
                        };
                    }
                }
            }
        }

        const tmpArrConnectionType = Array.from(new Set(arrMultiConnectionType));           //מחיקת כפולים
        var arrConnectionType = [];
        for (let i = 0; i < tmpArrConnectionType.length; i++) {                                   //המרה למערך של מפתח וערך
            let obj = {
                name: tmpArrConnectionType[i],
                amount: 0
            }
            arrConnectionType.push(obj)
            //arrConnectionType[tmpArrConnectionType[i]]=0;                                   //בהמשך נספור את הכמות שכל קשר מופיע
        }

        if (finalId !== '') {                         //אחרי שמצאנו איידי הולכים לבנות את המערך החדש
            var nodesToAdd = [];
            var linksToAdd = [];
            // console.log(finalId)

            for (let f in Data) {
                let newNode = Data[f];                        //בניית נוד
                newNode.id = Data[f][finalId];
                //console.log(newNode);
                nodesToAdd.push(newNode);

            }

            var tmpArr = Data;                      // חיפוש לינקים במערך המקורי כאשר כלפעם נחסיר את הנוכחי

            //const tmpArrForCheck = [...new Map(tmpArr.map(o => [o.id, o])).values()];   // ניקוי המערך עפ''י איידי שיהיה ללא כפולים - אם נרצה

            for (let item in tmpArr) {
                var searchItem = tmpArr[item][finalId];
                let itemToAddBack = tmpArr[item];
                var withoutCorrent = tmpArr;
                withoutCorrent.splice(item, 1);          //החסרה של הנוכחי
                for (let i in withoutCorrent) {
                    for (let key in withoutCorrent[i]) {
                        //console.log(key)
                        if (key !== finalId && key !== 'id') {         //חיפוש בכל השדות מלבד בשדה איידי
                            if (typeof withoutCorrent[i][key] === 'object') {
                                for (let j = 0; j < withoutCorrent[i][key].length; j++) {
                                    if (searchItem === withoutCorrent[i][key][j]) {
                                        //console.log( withoutCorrent[i][finalId], ' is ',key, ' ' , searchItem)
                                        let newLink = { target: withoutCorrent[i][finalId], source: searchItem, connectionType: key }
                                        linksToAdd.push(newLink)                //בניית לינק
                                        for (let i in arrConnectionType) {
                                            if (arrConnectionType[i].name === key) {
                                                let tmpAmount = arrConnectionType[i].amount;
                                                tmpAmount++;
                                                arrConnectionType[i].amount = tmpAmount;
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                console.log()
                                if (searchItem === withoutCorrent[i][key]) {
                                    //console.log(tmpArr[item][finalId], ' is ',key, ' ' , searchItem)
                                    let newLink = { source: withoutCorrent[i][finalId], target: searchItem, connectionType: key }
                                    linksToAdd.push(newLink);
                                    for (let i in arrConnectionType) {
                                        if (arrConnectionType[i].name === key) {
                                            let tmpAmount = arrConnectionType[i].amount;
                                            tmpAmount++;
                                            console.log(tmpAmount);
                                            arrConnectionType[i].amount = tmpAmount;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
                withoutCorrent.splice(item, 0, itemToAddBack)         //החזרה של הנוכחי 
                tmpArr = withoutCorrent;

            }
        }

        finalJson.nodes = nodesToAdd;
        finalJson.links = linksToAdd;

        console.log(finalJson)
        return (
            <div>
<Container>
    <Row><br/></Row>
    <Row><br/></Row>
    <Row>
        <Col xs={12}>    
        <FoundDataInFile passedFunction={this.RemoveConnection} data={arrKeysAndRadio} connections={arrConnectionType} />

        </Col>

    </Row>
    <Row>
        <Col>    
        <Button variant="outline-info" onClick={() => this.postJsonToDB(finalJson)}>Save To DB</Button>
        </Col>

    </Row>
    <Row>
        <Col xs={12}>
       <ForceGraph3D
                    graphData={finalJson}
                    nodeLabel="id"
                    linkLabel="connectionType"
                   // nodeLabel={node => {
                        // extend link with text sprite
                        //const sprite = new SpriteText(`${node.source} > ${node.target}`);
                        //sprite.color = 'lightgrey';
                        //sprite.textHeight = 1.5;
                       // return sprite;
                    //  }}
                    nodeAutoColorBy="id"
                    linkThreeObjectExtend={true}
                  //  linkThreeObject={link => {
                        // extend link with text sprite
                      //  const sprite = new SpriteText(`${link.source} > ${link.target}`);
                       // sprite.color = 'lightgrey';
                        //sprite.textHeight = 1.5;
                     //   return sprite;
                  //    }}
                    showNavInfo={false}
                    backgroundColor="rgb(164, 184, 204)"
                    linkWidth={2}
                //linkDirectionalParticles="value"
                //linkDirectionalParticleSpeed={d => d.value * 0.001}
                />
     
        </Col>
  
    </Row>
                {/*
                <ForceGraph3D
                    graphData={finalJson}
                    //nodeId={id}
                    //nodeLabel={node => `${node.user?node.user+': ':''}${node.description || node.id}`}
                    height={400}
                    //width={800}
                    showNavInfo={false}
                    backgroundColor="rgb(164, 184, 204)"
                    linkWidth={2}
                />
                */}
                

</Container>

                {/*
                <div>
                    <Container>
                        <Row>
                            <Col>
                                <DropdownButton id="dropdown-basic-button" onChange={this.titleChange} title={this.state.titleID}>
                                    {/* {arrRemoveDuplicate.map((opt, ratio) =>
                                        <Dropdown.Item href="#/action-1" onClick={this.IDfunction} >
                                            <Field index={opt} ratio={ratio} />
                                   </Dropdown.Item>)}*/}


                {/*}
                                    <Dropdown.Item href="#/action-1"  >
                                        <Field index={finalId} ratio={ratio} />
                                    </Dropdown.Item>
                                </DropdownButton></Col> <Col>
                                <DropdownButton id="dropdown-basic-button" onChange={this.titleChange2} title={this.state.titleRelationship}>
                                    {arrConnectionType.map(m =>
                                        <Dropdown.Item key={index} href="#/action-1" onClick={this.RelationshipFunc} >
                                            <Field index={m} />
                                        </Dropdown.Item>)}
                                </DropdownButton>
                            </Col>
                        </Row>
                    </Container>
                </div>*/}
                {/*
                <ForceGraph3D
                    graphData={finalJson}
                    nodeAutoColorBy={d => d.group % GROUPS}
                    // linkAutoColorBy={d => NewData.nodes[d.source].id%GROUPS}
                    backgroundColor="rgb(164, 184, 204)"
                    linkWidth={2}
                />*/}

{/*
                <Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={this.state.graphData}
                    config={myConfig}
                
                onClickNode={onClickNode}
                onDoubleClickNode={onDoubleClickNode}
                onRightClickNode={onRightClickNode}
                onClickGraph={onClickGraph}
                onClickLink={onClickLink}
                onRightClickLink={onRightClickLink}
                onMouseOverNode={onMouseOverNode}
                onMouseOutNode={onMouseOutNode}
                onMouseOverLink={onMouseOverLink}
                onMouseOutLink={onMouseOutLink}
                onNodePositionChange={onNodePositionChange}
                
                />
*/}
            </div >
        )
    }
}

export default withRouter(GraphEx); 