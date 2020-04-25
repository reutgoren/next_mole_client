import React, { Component } from 'react';
//import Data from "../gotData.json";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { ForceGraph3D } from 'react-force-graph';
import FoundDataInFile from './FoundDataInFile';
import gotData from '../gotData.json'
var finalJson = { nodes: [], links: [] }
var removedLinks = []       // הגדרת מערך ששומר את הקשרים שהוסרו


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
            json: ''
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
            let targW = targ.replace(/'/g, "");
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

    async componentDidMount() {
        const dataFromLocal = JSON.parse(localStorage.getItem('jsonRowData'));
        //const dataFromLocal = this.props.location.state.jsonDetails.rawData;
        //this.setState({ json: dataFromLocal });
        await this.setState({ json: dataFromLocal })

        this.getKeys(dataFromLocal)
        //console.log(dataFromLocal);
        //console.log(this.props.location.state.jsonDetails.rawData)
        //console.log(this.props.location.state.jsonDetails.subject)
        //console.log(this.props.location.state.jsonDetails.description)
        //console.log(this.props.location.state.jsonDetails.img)
    }

    getKeys = (rawArr) => {
        let totalObj = rawArr.length;                 //כמות איברים כוללת, משתנה עזר לחישוב רשיו  
        let arrAllKeys = [];                      //מערך של כ-ל המפתחות מכל איברי המערך גייסון כולל כפילויות
        Object.keys(rawArr).forEach(function (k) {
            const values = Object.keys(rawArr[k])
            values.map((i) => {
                arrAllKeys.push(i)
            });
        });
        let arrDistinctKeys = Array.from(new Set(arrAllKeys));       //מערך של כל המפתחות ללא כפולים
        this.countKeyRatio(arrDistinctKeys, arrAllKeys, totalObj)             //פונקציה שמוצאת כמות יחסית לכל מפתח
    }

    countKeyRatio = (arrDistinct, arrAll, totalObjCount) => {
        const arrKeysAndRadio2 = [];
        arrDistinct.map((i) => {
            var search = i;
            var countKey = arrAll.reduce(function (n, val) {        //פונקציה שסופרת כמה פעמים מופיע המפתח בסה"כ
                return n + (val === search);
            }, 0);
            let keyRatio = parseFloat((countKey / totalObjCount).toFixed(3));                   //חלוקה בכמות האיברים הכוללת למציאת יחסיות
            let objValues = this.addValues(i);
            console.log(objValues)
            let obj = {
                k: i, v: objValues, amount: countKey, ratio: keyRatio
            }
           
            arrKeysAndRadio2.push(obj)

        });
        arrKeysAndRadio2.sort(function (a, b) {           //מיון מערך מפתחות לפי סדר יורד של יחס כל מפתח
            return b.ratio - a.ratio;
        });
        console.log(arrKeysAndRadio2)
    }

    addValues = (index) => {          //פונקציה שמביאה את כל הערכים מהשדות בכל איבר 
        var val = [];
        var arrTmp = this.state.json;
        //console.log(arrTmp);
        const sampleJSON = {
            "arrOfNumbers": [1, 2, 3, 4],
            "arrOfStrings": ["a", "b", "c", "d"],
            "arrOfObjects": [{ "a": 1, "b": 1 }, { "a": 2, "b": 2 }, { "a": 3, "b": 3 }]
          }
          sampleJSON.arrOfObjects.map((item, i) => {
              let r= item.a - item.b
            console.log(r)
          })
        for(let g in arrTmp){
            //let me= Object.keys(arrTmp[g])
            
            //console.log(arrTmp[g].index.valueOf())
            //val.push(Object.values(arrTmp[g].index));     מביא אותיות
            //val.push(Object.values(arrTmp[g]));    פשוט מביא את כל הערכים של האיבר
            //val.push(Object.keys(arrTmp[g]))
           // val.push(console.log(Object.values(arrTmp[index])))
            //arrTmp[g].
               // Object.keys(arrTmp[g]).map((key) => (       //ככה זה מביא הכל מאיבר גייסון בודד
                   //val.push(arrTmp[g][key])
                       //console.log(arrTmp[g][key])
                   
              //  ))
              val.push(arrTmp[g].index)
             // if (typeof arrTmp[g][index] === "object") {
                //  console.log('im object')
                //for (let z in arrTmp[g][index]) {
                  //  arrDistinctt[j].v.push(arrTmp[r][arrDistinctt[j][u]][z]);
                    //val.push(arrTmp[r][arrDistinctt[j][u]][z]);
                //}
           // }
            //else {
                //if (typeof arrTmp[r][arrDistinctt[j][u]] !== "undefined") {
                  //  arrDistinctt[j].v.push(arrTmp[r][arrDistinctt[j][u]])
                    //val.push(arrTmp[r][arrDistinctt[j][u]])

                //}
            //}

        }
        console.log(val)
        /*
       
        for (let r in arrTmp) {
            for (let j in arrDistinctt) {
                for (let u in arrDistinctt[j]) {
                    if (typeof arrTmp[r][arrDistinctt[j][u]] === "object") {
                        for (let z in arrTmp[r][arrDistinctt[j][u]]) {
                            arrDistinctt[j].v.push(arrTmp[r][arrDistinctt[j][u]][z]);
                            //val.push(arrTmp[r][arrDistinctt[j][u]][z]);
                        }
                    }
                    else {
                        if (typeof arrTmp[r][arrDistinctt[j][u]] !== "undefined") {
                            arrDistinctt[j].v.push(arrTmp[r][arrDistinctt[j][u]])
                            //val.push(arrTmp[r][arrDistinctt[j][u]])

                        }
                    }
                }
            }
        }
        */
        return val

    }


    render() {
        const nada=[];
/*
        for (let k = 0; k < Data.length; k++) {
            Object.keys(sampleJSON2).map((key, i) => (       //ככה זה מביא הכל מאיבר גייסון בודד
                                                                //המטרה לעשות את זה לכל איבר במערך      
                nada.push(sampleJSON2[key])
                
            ))

        }
        console.log(nada)

*/

        var arrLength = 0;  //כמות האיברים במערך שבחר המשתמש

        const Data = this.props.location.state.jsonDetails.rawData;
        const jsonData = Data;
        var arr_temp_for_field = [];  //מערך עם כ-ל השדות מפתח מכל האובייקטים בגייסון, עם כפילויות
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


        arrKeysAndRadio.sort(function (a, b) {           //מיון בסדר יורד לפי יחס שמצאנו לכל מפתח
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
        /*const sampleJSON = {
            "object": {
              "name": "Pluralsight",
              "number": 1,
              "address": "India",
              "website": "https://www.pluralsight.com/"
            }
          }*/
        const sampleJSON = [{
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
            ]
        }, {
            "characterName": "Aeron Greyjoy",
            "houseName": "Greyjoy",
            "characterImageThumb": "https://images-na.ssl-images-amazon.com/images/M/MV5BNzI5MDg0ZDAtN2Y2ZC00MzU1LTgyYjQtNTBjYjEzODczZDVhXkEyXkFqcGdeQXVyNTg0Nzg4NTE@._V1._SX100_SY140_.jpg",
            "characterImageFull": "https://images-na.ssl-images-amazon.com/images/M/MV5BNzI5MDg0ZDAtN2Y2ZC00MzU1LTgyYjQtNTBjYjEzODczZDVhXkEyXkFqcGdeQXVyNTg0Nzg4NTE@._V1_.jpg",
            "characterLink": "/character/ch0540081/",
            "actorName": "Michael Feast",
            "actorLink": "/name/nm0269923/",
            "siblings": [
                "Balon Greyjoy",
                "Euron Greyjoy"
            ],
            "nickname": "Damphair"
        }];
        /*
                const shit= sampleJSON.map(a => {
                    Object.keys(a).map(key => ( //ככה זה מביא הכל מאיבר גייסון בודד
                        //המטרה לעשות את זה לכל איבר במערך   
                        console.log('Key Name: ',key, 'Value: ', a[key])  
                       
                    ))
                })
                */
        const sampleJSON2 = {
            "characterName": "Aeron Greyjoy",
            "houseName": "Greyjoy",
            "characterImageThumb": "https://images-na.ssl-images-amazon.com/images/M/MV5BNzI5MDg0ZDAtN2Y2ZC00MzU1LTgyYjQtNTBjYjEzODczZDVhXkEyXkFqcGdeQXVyNTg0Nzg4NTE@._V1._SX100_SY140_.jpg",
            "characterImageFull": "https://images-na.ssl-images-amazon.com/images/M/MV5BNzI5MDg0ZDAtN2Y2ZC00MzU1LTgyYjQtNTBjYjEzODczZDVhXkEyXkFqcGdeQXVyNTg0Nzg4NTE@._V1_.jpg",
            "characterLink": "/character/ch0540081/",
            "actorName": "Michael Feast",
            "actorLink": "/name/nm0269923/",
            "siblings": [
                "Balon Greyjoy",
                "Euron Greyjoy"
            ],
            "nickname": "Damphair"
        }
       
        return (
            <div>
                {

                    Object.keys(sampleJSON2).map((key) => (       //ככה זה מביא הכל מאיבר גייסון בודד
                        <p>
                            <span>Key Name: {key}</span>
                            <span>Value: {sampleJSON2[key]}</span>
                        </p>
                    ))

                    /*
                   sampleJSON.map(a => {
                       Object.keys(a).map(key => ( //ככה זה מביא הכל מאיבר גייסון בודד
                           //המטרה לעשות את זה לכל איבר במערך     
                           <p>
                               <span>Key Name: {key}</span>
                               <span>Value: {a[key]}</span>
                           </p>
                       ))
                   })

*/
                }
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