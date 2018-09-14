import React from 'react';
import { Row, Col } from 'reactstrap';

const Index = ({ className, data, col, isDivide }) => (
  <div className={`thumbnails-comp ${className || ''}`}>
    <Row>
      {
        data.map(thumb => (
          <Col key={thumb.key} className="thumb-col" md={{ size: parseInt(12 / col, 10) }}>
            <h3 className="thumb-title">{thumb.title}</h3>
            <img alt="" className="thumb-img" src={thumb.imgUrl} />
            <h5 className="thumb-sub-title">{thumb.subTitle}</h5>
            <ul className="thumb-info">
              {
                thumb.infos.map(info => (
                  <li key={info.key} className="thumb-info-li">{info.text}</li>
                ))
              }
            </ul>
            { isDivide ? <div className="line-v" /> : null}
          </Col>
        ))
      }
    </Row>
  </div>
);

export default Index;
