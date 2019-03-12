import React from 'react';

export default function bindDialogHOC (WrappedComponent) {
  class Wrapper extends React.Component {

    toggleDialog = () => {
      this.props.uiAction.toggleDialog();
    }

    openCustomDialog = (config) => {
      this.props.uiAction.openCustomDialog(config);
    }

    render = () => (
      <WrappedComponent {...this.props}
        toggleDialog={this.toggleDialog}
        openCustomDialog={this.openCustomDialog}
      />);
  }

  return Wrapper;
}
