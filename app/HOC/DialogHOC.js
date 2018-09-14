import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


const DialogHOC = Component => (
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = props.initialModel || { open: false };
    }

    updateState = updateState => this.setState(updateState);

    render() {
      return React.createElement(Component, {
        ...this.props,
        ...this.state,
        ...{ updateState: this.updateState }
      });
    }
  }
);


export default DialogHOC;
