import React from 'react';
import { Row, Col } from 'reactstrap';
import { footerMidInfoArr } from '../../constants/navData';
import LinkFormat from '../common/LinkFormat/index';

const FooterMid = ({ offline, offlineWarning }) => (
  <div className="middle-part-bg">
    <Row className="middle-part-ul">
      {
        footerMidInfoArr.map((d, i) => (
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
      }
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
    </Row>
  </div>
);

export default FooterMid;
