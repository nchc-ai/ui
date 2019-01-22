import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { KeyValue } from 'react-key-value';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';

class FileUpload extends Component {

  constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        csvList: []
      }
      this.uploadInput = React.createRef();
  }

  onFileChange = (e) => {
    const csvFile = e.target.files[0];
  }

  onListChange = (students) => {
    const studentsList = students.map(d => d.valueItem)

    console.log('students', studentsList)
    this.props.onListChange(studentsList);
  }

  handleUploadFile = (ev) => {
    const {
      roomAction,
      token
    } = this.props;
    const { files } = this.uploadInput.current;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('filename', files[0].name);

    // 上傳
    this.props.roomAction.upladStudentsCSV({
      token,
      formData
    })
  }

  render() {
    const {
      students
    } = this.props;

    return(
      <div className="container form-group">
        {
          students.length === 0 ?
            <div>
              <input
                className="form-control"
                ref={this.uploadInput}
                onChange={this.onFileChange}
                type="file" />
            </div>
          : null
        }
        {
          students.length > 0 ?
          <KeyValue
            rows={students}
            customAddButtonRenderer={ (handleAddNew) => (
              <div>
                <div onClick={ handleAddNew } >
                  <span>+</span> 新增一筆
                </div>
              </div>
            ) }
            onChange={students => this.onListChange(students)}
            hideLabels
          />
          :
          null
        }
        {
          students.length === 0 ?
            <button
              onClick={this.handleUploadFile}
              className="btn btn-success"
            >
              上傳 csv 檔案
            </button>
          :
            null
        }
      </div>
    )
  }
}

const mapStateToProps = ({ Auth, Classroom }) => ({
  token: Auth.token,
  students: Classroom.students.data
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(FileUpload);;