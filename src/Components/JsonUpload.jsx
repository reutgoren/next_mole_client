import React from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import JSONTree from 'react-json-tree';

export default class JsonUpload extends React.Component{
    
    state={
        fileContent:''
    }

    AddPDF = (error, file)=>{
        if(this.fileValidate(file)){
            //this.props.sendJsonData(file);

            //אם הקובץ שעלה עומד בתנאים עכשיו ניתן להעלות אותו לסרבר
            //save to DB using fetch
            //או
            // קריאת התוכן של הקובץ:
            this.readJsonFile(file.file);
        }
    }

    fileValidate = (file)=>{
        let isValid = true;
        console.log(file.fileExtension)
        //אם הקובץ לא קובץ ג'ייסון, לא לאפשר העלאה.
        if (file.fileExtension!=='js') {
            alert("not a valid json/js file");
            file.abortLoad();
            isValid = false;
        }
        return isValid;
    }

    readJsonFile = (file)=>{
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt)=>{
            //console.log(evt.target.result);
            this.props.sendJsonData(evt.target.result);
            this.setState({fileContent:JSON.parse(evt.target.result)})
        }
        reader.onerror = (evt) =>{
            console.log("error reading file");
        }
    }

    render(){
        return(
            <div style={divStyle}>
                <FilePond allowMultiple={false} onaddfile={this.AddPDF} labelIdlE='FILE UPLOAD'/>
                {this.state.fileContent!==''&&<JSONTree data={this.state.fileContent} />}
            </div>
        )
    }
}
const divStyle = {
    //padding:'150px'
} 