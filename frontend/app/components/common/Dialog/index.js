import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Modal from 'react-modal';
import _ from 'lodash';
import { Button } from 'reactstrap';
import * as types from '../../../constants/types';
import DialogHOC from '../../../HOC/DialogHOC';


const DialogButton = ({ width, customStyle, children, title, submitButton, open, closeMethod, cancelMethod, resetMethod, confirmMethod, openButton, updateState }) => (
  <div>
    <Modal
      style={{ content: { width: `${width ? width : '300'}px` } }}
      isOpen={open}
      contentLabel="modal"
    >
      <div className="common-modal-bg">
        <div className="modal-header-con">
          <span>{title}</span>
        </div>

        <div
          className="model-content-con"
          style={customStyle}
        >
          {children}
        </div>

        <div className="modal-button-bg">
          <div className="modal-button-con">

            <button
              className="submit-btn btn-grp"
              onClick={() => confirmMethod()}
            >
              {submitButton.confirm}
            </button>

            <button
              className="cancel-btn btn-grp"
              onClick={() => updateState({ open: !open })}
            >
              {submitButton.cancel}
            </button>

          </div>
        </div>

      </div>
    </Modal>
    {openButton
      ?
        <button
          className="action-btn"
          onClick={() => updateState({ open: !open })}
        >
          <span className="action-word">{openButton.text}</span>
          {openButton.icon}
        </button>
      :
        <Button
          color="accent"
          onClick={() => updateState({ open: !open })}
          raised
        >
          Open Dialog
        </Button>}
  </div>
);

// const DialogHOC = Component => (
//   class extends React.Component {
//     constructor(props) {
//       super(props);

//       // this.state = props.initialModel || { open: false };
//     }

//     updateState = updateState => this.setState(updateState);

//     render() {
//       return React.createElement(Component, {
//         ...this.props,
//         ...this.state,
//         ...{ updateState: this.updateState }
//       });
//     }
//   }
// );

// const mapProps = fn => Component => props => (
//   React.createFactory(Component)(fn(props))
// );

// const compose = (propFn, highOrderComponent) => x => {
//   return propFn(highOrderComponent(x));
// };

// const enhanceDialog = compose(
//   mapProps(({ ...props }) => ({ ...props })),
//   DialogHOC,
// );

// const DialogWrapper = enhanceDialog(DialogButton);


const mapStateToProps = ({ Ui }) => ({
  open: Ui.Dialog.open
});

export default compose(
  connect(
    mapStateToProps,
    // mapDispatchToProps
  ),
  DialogHOC
)(DialogButton);

// export default DialogWrapper;
