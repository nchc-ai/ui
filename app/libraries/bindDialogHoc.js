import React from 'react';

export default function bindDialogHoc (WrappedComponent) {
  class Wrapper extends React.Component {

    toggleDialog = () => {
      this.props.uiAction.toggleDialog();
    }

    setDialogInfo = ({ title }) => {
      this.props.uiAction.setDialogInfo({
        info: {
          title,
          info: 'info',
          target: 'target',
          cancelText: 'cancel',
          cancelMethod: 'cancelMethod',
          submitText: 'submitText',
          submitMethod: 'method'
        }
      });
    }

    render = () => (
      <WrappedComponent {...this.props}
        toggleDialog={this.toggleDialog}
      />);
  }

  return Wrapper;
}
