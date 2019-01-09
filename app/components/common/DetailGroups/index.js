import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';

const DetailGroups = ({
  frameData,
  detailData
}) => {
  return (
    <div className="detail-groups-comp">
      {
        frameData.map(d => (
          <Row key={d.key} className={`detail-group detail-group-${d.name}`}>
            <Col md={{ size: d.size || 12 }}>
              {/* [detail] 一般文字 */}
              {
                d.detailType === 'text'
                ?
                  <div className="detail-group">
                    <span className="col-icon col-grp">{_.get(detailData, d.icon)}</span>
                    <span className="col-label col-grp">{d.mainLabel}: </span>
                    <span className="value-empty col-value col-grp">{_.get(detailData, d.name, "目前尚無資料")}</span>
                  </div>
                :
                  null
              }
            </Col>
          </Row>
        ))
      }
    </div>
  )
};

export default DetailGroups;
