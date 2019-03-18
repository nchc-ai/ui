import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { notify } from 'components/common/NotifyToast';
import { TOAST_TIMING } from '../../../constants';
import KeyValue from '../KeyValue/index';
import bindActionCreatorHOC from '../../../libraries/bindActionCreatorHOC';

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

  // onListChange = (changedRow) => {
  //   const {
  //     students,
  //     onListChange,
  //     roomAction
  //   } = this.props;

  //   // console.log('changedRow', changedRow);

  //   const studentsToUpload = changedRow.map(student => ({
  //     label: student.keyItem,
  //     value: student.valueItem
  //   }))

  //   // console.log('studentsToUpload', studentsToUpload, changedRow);
  //   roomAction.setStudentsField({ students: studentsToUpload })
  //   // onListChange(studentsToUpload);
  // }

  handleFileReset = () => {
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
      students,
      onFileListChange
    } = this.props;

    return(
      <div className="container form-group">

        <KeyValue
          rows={students}
          onChange={onFileListChange}
          config={{
            headerText: '姓名 | 信箱',
            addText: '新增學生',
            keyText: '姓名',
            keyPlaceholder: '王聰明',
            valueText: '信箱',
            valuePlaceholder: 'smartwang@gmail.com',
            resetText: '重新上傳'

          }}
          handleReset={this.handleFileReset}
          isReset
        />
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
  bindActionCreatorHOC
)(FileUpload);;