import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';
import styled from 'styled-components';
import * as dialogTypes from 'constants/dialogTypes';

const Button = styled.button`

  width: 100px;
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
  color: #fff;
  letter-spacing: 10px;
  text-indent: 10px;
  text-align: center;
  background-color: #2a9b9d;
  border-radius: 6px;
  line-height: 38px;
  float: left;
  outline: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    text-decoration: none;
  }
`;

const SubmitButton = styled(Button)`
  background-color: ${props => props.type === dialogTypes.DELETE ? '#fa7564' : '#2a9b9d'};
`

const CancelButton = styled(Button)`
  color: #000;
  background-color: #EAEAEA;
`


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

          <SubmitButton
            type={dialog.type}
            onClick={dialog.submitMethod}
          >
            {dialog.submitText}
          </SubmitButton>

          <CancelButton
            onClick={dialog.cancelMethod}
          >
            {dialog.cancelText}
          </CancelButton>

        </div>
      </div>

    </div>
  </Modal>
);

export default Dialog;
