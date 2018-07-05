import React from 'react';
import { Row, Col } from 'reactstrap';
import { formatValue } from '../../../libraries/utils';

const ListView = ({ data, col }) => (
  <div className="list-view-comp">
    <Row>
      {
        data.map(d => (
          <Col
            key={d.key}
            md={{ size: col ? 12 / col : 12 }}
            className="list-view-li"
          >
            <span className="col-icon col-grp">{d.icon}</span>
            <span className="col-label col-grp">{d.label}: </span>
            {
              formatValue(d) === '' ?
                <span className="value-empty col-value col-grp">目前尚無資料</span>
              :
                <span className="value col-value col-grp">{formatValue(d)}</span>
            }
          </Col>
        ))
      }
    </Row>
  </div>
);

export default ListView;
