import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';

class FileUpload extends Component {

  constructor(props) {
    super(props);
      this.state = {
        uploadStatus: false
      }
      this.uploadInput = React.createRef();
  }

  onFileChange = (e) => {
    const csvFile = e.target.files[0];
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
    return(
      <div className="container">
          <div className="form-group">
            <input
              className="form-control"
              ref={this.uploadInput}
              onChange={this.onFileChange}
              type="file" />
          </div>

          <button onClick={this.handleUploadFile} className="btn btn-success" type="submit">上傳</button>
      </div>
    )
  }
}

const mapStateToProps = ({ Auth }) => ({
  token: Auth.token,
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(FileUpload);;