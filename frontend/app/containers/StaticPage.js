import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Container } from "reactstrap";
import _ from "lodash";
import bindActionCreatorHoc from "../libraries/bindActionCreatorHoc";

class StaticPage extends Component {

  static propTypes = {
  }

  render = () => {
    return (
      <div className="static-bg global-content">

      </div>
    );
  }
}

export default compose(
  bindActionCreatorHoc
)(StaticPage);
