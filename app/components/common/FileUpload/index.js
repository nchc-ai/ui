import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import { TOAST_TIMING } from '../../../constants';
import KeyValue from '../KeyValue/index';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';

class FileUpload extends Component {

  constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false,
        isUploadEnable: false,
        csvList: []
      }
      this.uploadInput = React.createRef();
  }

  onFileChange = (e) => {
    const csvFile = e.target.files[0];
    if (csvFile.name) {
      this.setState({ isUploadEnable: true })
      notify.show('已加入檔案至上傳佇列', 'success', TOAST_TIMING);
    }
  }

  onListChange = () => {
    const studentsList = this.props.students.map(d => d.valueItem)
    this.props.onListChange(studentsList);
  }

  handleFileReset = (e) => {
    e.preventDefault();
    // swap redux state > reset upload
    this.setState({ isUploadEnable: true });
    this.props.roomAction.resetStudentsField();
  }

  handleUploadFile = (e) => {
    e.preventDefault();

    const {
      roomAction,
      token
    } = this.props;
    const { files } = this.uploadInput.current;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('filename', files[0].name);

    // 上傳
    roomAction.uploadStudentsCSV({
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
              onChange={this.onListChange}
              config={{
                headerText: 'Index | Student',
                addText: '新增學生',
                keyText: '順序',
                valueText: '學生',
                resetText: '重新上傳'
              }}
              handleReset={(e) => this.handleFileReset(e)}
              isReset
            />
          :
          null
        }
        {
          students.length === 0 && this.state.isUploadEnable ?
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