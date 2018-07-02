import React from 'react';
import { Row, Col } from 'reactstrap';
import { footer } from '../../constants/navData';
import footerLogo from '../../../public/images/index/footer-logo.png';
import LinkFormat from '../common/LinkFormat/index';
import NavBar from '../Header/NavBar';

const FooterMid = ({ offline, offlineWarning }) => (
  <div className="middle-part-bg">
    <Row className="middle-part-ul">
      {/* {
        footer.midInfoArr.map((d, i) => (
          <Col key={i} className={`footer-part footer-part-${i} ${d.className}`}>
            <div className="part-container">
              <h5 className="title">{d.title}</h5>
              <div className="info-container">
                <ul>
                  {
                    d.infoArr.map((textObj, j) => (
                      <li key={j} className="info-li">
                        <LinkFormat
                          textObj={textObj}
                          offline={offline}
                          offlineWarning={offlineWarning}
                        />
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </Col>
        ))
      } */}
      {/* 兩個icon */}
      {/* <Col className="col-xs-12 col-sm-12 col-md-2 col-md-offset-2 col-12">
        <div className="icon-ul">
          {
            footerTopIconArr.map((d, i) => (
              <li key={i}>
                <a rel="noopener noreferrer" target="_blank" href={d.url}>
                  <img alt="" src={d.imgUrl} />
                </a>
              </li>
            ))
          }
        </div>
      </Col> */}

      <img alt="" className="footer-logo" src={footerLogo} />

      <div className="line-h" />
      
      <NavBar
        data={footer.midBriefArr}
        offlineWarning={offlineWarning}
      />



    </Row>
  </div>
);

export default FooterMid;
