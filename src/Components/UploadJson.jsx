import React from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import JSONTree from 'react-json-tree';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal)


export default class UploadJson extends React.Component {

    state = {
        fileContent: ''
    }

    AddFile = (error, file) => {
        if (this.fileValidate(file)) {
            //this.props.sendJsonData(file);

            //אם הקובץ שעלה עומד בתנאים עכשיו ניתן להעלות אותו לסרבר
            //save to DB using fetch
            //או
            // קריאת התוכן של הקובץ:
            this.readJsonFile(file.file);
            //this.props.state.originalJson = file;
            
        }
    }

    fileValidate = (file) => {
        let isValid = true;
        console.log(file.fileExtension)
        if (file.fileExtension !== 'js' & file.fileExtension !== 'json') {          //אם הקובץ לא קובץ ג'ייסון/גאווה סקריפט, לא לאפשר העלאה.
            MySwal.fire({
                title: 'Error!',
                text: 'You can only choose JS or JSON files to uploaded',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            file.abortLoad();
            isValid = false;
        }
        return isValid;
    }

    readJsonFile = (file) => {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            //console.log(evt.target.result);
            this.props.sendJsonData(evt.target.result);
            this.setState({ fileContent: JSON.parse(evt.target.result) })
        }
        reader.onerror = (evt) => {
            console.log("error reading file");
        }
    }

    saveJsonToDB = (file) => {              // הקריאה לפונקציה מתבצעת בקומפוננטה דף הבית כאשר נלחץ אישור טופס
        console.log(file);
        const data = new FormData();
        data.append("UploadedFile", file);
        //גישה לקונטרולר
        fetch('https://localhost:44312/api/fileUpload', {
            method: 'post',
            contentType: false,
            processData: false,
            mode: 'no-cors',
            body: data
        }).then(function (data) {
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });
    }
    getAlert() {
        alert('clicked');
      }
    render() {
        const theme = {
            scheme: 'atelier lakeside',
            author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/lakeside/)',
            base00: '#161b1d',
            base01: '#1f292e',
            base02: '#516d7b',
            base03: '#5a7b8c',
            base04: '#7195a8',
            base05: '#7ea2b4',
            base06: '#c1e4f6',
            base07: '#ebf8ff',
            base08: '#d22d72',
            base09: '#935c25',
            base0A: '#8a8a0f',
            base0B: '#568c3b',
            base0C: '#2d8f6f',
            base0D: '#257fad',
            base0E: '#5d5db1',
            base0F: '#b72dd2'
          };
        return (
            <div style={divStyle}>
                <FilePond allowMultiple={false} onaddfile={this.AddFile} labelIdlE='FILE UPLOAD' />
                {this.state.fileContent !== '' && <JSONTree data={this.state.fileContent} shouldExpandNode={() => false} theme={{
                    extend: theme,
                    // underline keys for literal values
                    valueLabel: {
                        textDecoration: 'underline',
                    }
                    // `nestedNodeLabel` receives additional arguments `expanded` and `keyPath`
                    
                }} />}
            </div>
        )
    }
}
const divStyle = {
    //padding:'150px'
} 
