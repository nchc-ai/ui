import React from 'react';

export default function bindProgressBarHOC(WrappedComponent) {
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

      this.timer = setTimeout(
        function() {
          this.props.uiAction.removeProgressBar();
        }
        .bind(this),
        1000
      );
    }

    render = () => (
      <WrappedComponent {...this.props}
        startProgressBar={this.startProgressBar}
        endPorgressBar={this.endPorgressBar}
      />);
  }

  return Wrapper;
}
