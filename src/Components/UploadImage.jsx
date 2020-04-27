import React from 'react';
import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import { withRouter } from 'react-router-dom';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal)
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class FileUpload extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Set initial files, type 'local' means this is a file
            // that has already been uploaded to the server (see docs)
            files: [{
                source: 'photo.jpeg',
                options: {
                    type: 'local'
                }
            }]
        };
    }





    AddPDF = (error, file) => {
        console.log(file)
        if (this.fileValidate(file)) {
            //this.props.sendJsonImage(file);
            console.log(file)
            console.log(file.file)

            // קריאת התוכן של הקובץ:
            this.readJsonImage(file.file);

            //אם הקובץ שעלה עומד בתנאים עכשיו ניתן להעלות אותו לסרבר
            //save to DB
            // this.saveToDB(file);
        }
    }



    fileValidate = (file) => {
        console.log(file.fileExtension)
        let isValid = true;
        if (file.fileExtension !== 'jpeg' & file.fileExtension !== 'png' & file.fileExtension !== 'jpg') {
                MySwal.fire({
                    title: 'Error!',
                    text: 'You can only choose png or jpeg files to uploaded',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
                file.abortLoad();
                isValid = false;
        }
        if (isValid) {
            console.log(file.fileExtension);
            console.log(file.fileSize);
        }
        return isValid;
    }

    readJsonImage = (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file, "UTF-8");
        //reader.readAsDataURL(file, {type: 'text/plain'});

        reader.onload = (evt) => {
            console.log(evt.target.result);
            this.props.sendJsonImage(evt.target.result);
            //this.setState({fileContent:JSON.parse(evt.target.result)})
        }
        reader.onerror = (evt) => {
            console.log("error reading file");
        }
    }


    saveToDB = (file) => {
        console.log(file.file);

        const data = new FormData();
        data.append("UploadedFile", file.file);
        //גישה לקונטרולר
        fetch('http://localhost:50104/api/uploadPic', {
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

    // saveToFirebaseStorage = (file)=>{
    //     const groupData = JSON.parse(localStorage.getItem('groupData'));
    //     const uploadPic = storage.ref('images/'+groupData.GroupName+'/ProjectDocument/'+file.name).put(file);
    //     uploadPic.on('state_changed',
    //     (snapshot)=>{
    //     },(error)=>{
    //         console.log(error);
    //     },
    //     ()=>{
    //         storage.ref('images/'+groupData.GroupName+'/ProjectDocument/'+file.name).getDownloadURL()
    //         .then((url)=>{
    //             this.props.savePDF(url);
    //         })
    //     })
    // }


    handleInit() {
        console.log('FilePond instance has initialised', this.pond);
        let fil = this.pond;
        console.log(fil);

    }



    render() {
        return (
            <div style={divStyle}>
                <FilePond
                    allowMultiple={false} onaddfile={this.AddPDF} />

            </div>
        )
    }
}
export default withRouter(FileUpload); 

const divStyle = {
    //padding:'150px'

}


