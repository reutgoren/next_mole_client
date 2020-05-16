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

export default class UploadImage extends React.Component {

    /*constructor(props) {
        super(props);
        this.state = {
            files: [{
                source: 'photo.jpeg',
                options: {
                    type: 'local'
                }
            }]
        };
    }
*/ state = {
    fileImg: ''
}

    AddPDF = (error, file) => {
        console.log(file)
        if (this.fileValidate(file)) {
            // read file
            //this.readJsonImage(file.file);
            this.props.sendJsonImage(file);
            this.setState({ fileImg: file })
        }
    }
    getAlert() {
        alert('child2');
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

    getAlert() {
        alert('clicked');
      }
    
    saveImgToDB = (file) => {
        console.log(file.file);
        const data = new FormData();
        data.append("UploadedFile", file.file);
        fetch('http://localhost:44312/api/uploadPic', {
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

    handleInit() {
        console.log('FilePond instance has initialised', this.pond);
        let fil = this.pond;
        console.log(fil);
    }

    render() {
        return (
            <div>
                <FilePond allowMultiple={false} onaddfile={this.AddPDF} />
            </div>
        )
    }
}
//export default withRouter(UploadImage); 



