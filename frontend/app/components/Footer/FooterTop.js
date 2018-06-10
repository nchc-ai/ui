import React from 'react';
import { Link } from 'react-router-dom';
// import trackerImg from '../../images/common/footer-tracker.png';

const FooterTop = ({ offline, offlineWarning }) => (
  <div className="top-part-bg">
    <span className="v-helper" />
    <div className="top-part-con">
      {/* <img alt="" src={trackerImg} /> */}
      <span className="v-helper" />
      {
        offline ?
          <span className="footer-top-text" onClick={offlineWarning}>需求調查表</span>
          :
          <Link className="footer-top-text" to="/intro/survey">需求調查表</Link>
      }
      
    </div>
  </div>
);

export default FooterTop;
