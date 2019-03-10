import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';

const Dialog = ({ width, customStyle, dialog }) => (
  <Modal
    style={{ content: { width: `${width ? width : '300'}px` } }}
    isOpen={dialog.isOpen}
    contentLabel="modal"
    ariaHideApp={false}
  >
    <div className="common-modal-bg">
      <div className="modal-header-con">
        <span>{dialog.title}</span>
      </div>

      <div
        className="model-content-con"
        style={customStyle}
      >
        <p>{dialog.info}</p>
      </div>

      <div className="modal-button-bg">
        <div className="modal-button-con">

          <button
            className="submit-btn btn-grp"
            onClick={e => dialog.submitMethod(dialog.target)}
          >
            {dialog.submitText}
          </button>

          <button
            className="cancel-btn btn-grp"
            onClick={dialog.cancelMethod}
          >
            {dialog.cancelText}
          </button>

        </div>
      </div>

    </div>
  </Modal>
);

export default Dialog;
