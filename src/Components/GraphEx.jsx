import React, { Component } from 'react';
//import Data from "../gotData.json";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
import FoundDataInFile from './FoundDataInFile';

var finalJson = { nodes: [], links: [] }
var removedLinks = []       // הגדרת מערך ששומר את הקשרים שהוסרו


class GraphEx extends Component {
    constructor(props) {
        super(props)
        let local = false;
        //let local = true;
        this.apiUrl = 'https://localhost:44312/api/';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup8/prod/api/';
        }
    }
 
    postJsonToDB = (file) => {                              //שמירה של צמתים וקשתות לדאטה בייס
        const nodesList = file.nodes.map(item => {
            let str = JSON.stringify(item)
            let strW = str.replace(/'/g, "");
            let id = item.id;
            let idW = id.replace(/'/g, "");
            var singleNode = {
                NodeNum: idW,
                NodeDescription: strW
            }
            return singleNode;
        })
        const linksList = file.links.map(item => {
            let sour = item.source.id;
            let sourW = sour.replace(/'/g, "");
            let targ = item.target.id;
            let targW =targ.replace(/'/g, "");
            var singleLink = {
                SourceNode: sourW,
                TargetNode: targW,
                ConnectionType: item.connectionType,
                ConnectionWeight: 1

            }
            return singleLink;
        })
        console.log(linksList)
        fetch(this.apiUrl + 'nodes', {        //POST nodes
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

        fetch(this.apiUrl + 'links', {              //POST links
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

    RemoveConnection = (x) => {             //הסרת והחזרה סוג קשר   
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

        console.log(this.props.location.state.jsonDetails.rawData)
        console.log(this.props.location.state.jsonDetails.subject)
        console.log(this.props.location.state.jsonDetails.description)
        console.log(this.props.location.state.jsonDetails.img)

        const Data= this.props.location.state.jsonDetails.rawData;
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
            })
            ratio.push(countRatio);
        });

        let str = "";
        jsonData.map((i, m) => {
            const values = Object.keys(jsonData[m])
            values.map((x, c) => {
                str += values[c].toString() + "*****" + Data[m][x].toString() + "*****";
            })

        })
        var test = str.split("*****");

        var count = 0;
        var t = []
        test.map((i, z) => {
            count++;
            if (count % 2 === 1) {
                t.push(test[z] + "****" + test[z + 1]);
            }
        })
        const arrClean = Array.from(new Set(t));            //מערך לאחר ניקוי ערכים כפולים
        let s = ""
        arrClean.map((i) => {
            s += "****" + i
        })
        /*                                //כל המחרוזת עם כל המפתחות והשדות עם **** ביניהם
        const v = s.split("****");          //המרה לצורת מערך.... 
       
        
*/
        var arr = []       
        for (let i = 0; i < arrField.length; i++) {
            var y = {
                k: arrField[i], v: []
            }
            arr.push(y)
        }
        for (let r in Data) {                                    
            for (let j in arr) {
                for (let u in arr[j]) {
                    if (typeof Data[r][arr[j][u]] === "object") {
                        for (let z in Data[r][arr[j][u]]) {
                            arr[j].v.push(Data[r][arr[j][u]][z]);
                        }
                    }
                    else {
                        if (typeof Data[r][arr[j][u]] !== "undefined") {
                            arr[j].v.push(Data[r][arr[j][u]])
                        }
                    }
                }
            }
        }
        var arrKeysAndRadio = [];        //מערך של כל המפתחות והיחס שלהם
        for (let t in arr) {
            var TemparrremoveDuplicate = Array.from(new Set(arr[t].v));
            let objToAdd = {
                k: arr[t].k, v: TemparrremoveDuplicate
            }
            arrKeysAndRadio.push(objToAdd)
        }

        var index = Data.length                  // כמה רשמות יש לנו ב JSON

        for (let z in arrKeysAndRadio) {                                // הוספת ערך יחסי של כל מפתח
            let calcRatio = (arrKeysAndRadio[z].v.length / index).toFixed(3);
            arrKeysAndRadio[z]["ratio"] = parseFloat(calcRatio)
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
            for (let z in arrKeysAndRadio) {
                if (z !== '0') {
                    for (let j in testt.v) {           
                        for (let u in arrKeysAndRadio[z].v) {
                            if (arrKeysAndRadio[z].v[u] === testt.v[j]) {                  
                                arrMultiConnectionType.push(arrKeysAndRadio[z].k);
                                if (finalId !== testt.k) {
                                    finalId = testt.k;
                                }

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
        }

        if (finalId !== '') {                         //אחרי שמצאנו איידי הולכים לבנות את המערך החדש
            var nodesToAdd = [];
            var linksToAdd = [];
            for (let f in Data) {
                let newNode = Data[f];                        //בניית נוד
                newNode.id = Data[f][finalId];
                nodesToAdd.push(newNode);

            }

            var tmpArr = Data;                      // חיפוש לינקים במערך המקורי כאשר כלפעם נחסיר את הנוכחי

            for (let item in tmpArr) {
                var searchItem = tmpArr[item][finalId];
                let itemToAddBack = tmpArr[item];
                var withoutCorrent = tmpArr;
                withoutCorrent.splice(item, 1);          //החסרה של הנוכחי
                for (let i in withoutCorrent) {
                    for (let key in withoutCorrent[i]) {
                        if (key !== finalId && key !== 'id') {                   //חיפוש בכל השדות מלבד בשדה איידי
                            if (typeof withoutCorrent[i][key] === 'object') {
                                for (let j = 0; j < withoutCorrent[i][key].length; j++) {
                                    if (searchItem === withoutCorrent[i][key][j]) {
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
                    <Row><br /></Row>
                    <Row><br /></Row>
                    <Row>
                        <Col xs={12}>
                            <FoundDataInFile passedFunction={this.RemoveConnection} data={arrKeysAndRadio} details={this.props.location.state.jsonDetails} connections={arrConnectionType} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="btn btn-info " onClick={() => this.postJsonToDB(finalJson)}>Save network to DB</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <ForceGraph3D
                                graphData={finalJson}
                                nodeLabel="id"
                                linkLabel="connectionType"                          
                                nodeAutoColorBy="id"
                                nodeRelSize={8}
                                width="1000px"
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