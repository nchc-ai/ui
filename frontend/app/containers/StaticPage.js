import React, { Component } from 'react';
import { compose } from 'redux';
import _ from 'lodash';
import SectionTitle from '../components/common/SectionTitle/index';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';


class StaticPage extends Component {

  static propTypes = {
  }

  render = () => {
    return (
      <div className="static-bg global-content">
        <div className="static-container">
          <h5>404</h5>
          <div className="line-h"></div>
          <p>抱歉，您要找的頁面不存在。 </p>
        </div>
      </div>
    );
  }
}

export default compose(
  bindActionCreatorHoc
)(StaticPage);
