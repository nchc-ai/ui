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
          <SectionTitle
            titleImgUrl={"/"}
            info="抱歉，您要找的頁面不存在。"
            isTitleImg
            isUnderline
          />
        </div>
      </div>
    );
  }
}

export default compose(
  bindActionCreatorHoc
)(StaticPage);
