import React from 'react';

export default function bindIntervalHoc(WrappedComponent) {
  class Wrapper extends React.Component {

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    startProgressBar = () => {
      let progress = 0;
      this.interval = setInterval(() => {
        progress += parseInt(Math.random() * 4);
        this.props.uiAction.toggleProgressBar({ toggle: true, progress });
      }, 1400);
    }

    endPorgressBar = () => {
      this.props.uiAction.toggleProgressBar({ toggle: true, progress: 100 });
      clearInterval(this.interval);
    }

    render = () => (
      <WrappedComponent {...this.props}
        startProgressBar={this.startProgressBar}
        endPorgressBar={this.endPorgressBar}
      />);
  }

  return Wrapper;
}
