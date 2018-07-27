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
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSd3WTXGCQX0tjILHn6Dvlmnkzs3lLBdVX1Xfsuq0m0WzZfXzQ/viewform?usp=pp_url"
            rel="noopener noreferrer"
            target="_blank"
            className="footer-top-text" to="/"
          >
            需求調查表
          </a>
      }
      
    </div>
  </div>
);

export default FooterTop;
