import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import DataFrame from '../../common/DataFrame/index';
import { formatValue } from '../../../libraries/utils';

const ListView = ({ data, col }) => {
  console.log('data', data);
  return (
  <div className="list-view-comp">
    <DataFrame
      data={data}
      cols={8}
    >
      <Row>
        {
          data.map(d => (
            <Col
              key={d.key}
              md={{ size: col ? 12 / col : 12 }}
              className={`list-view-li list-view-li-${d.labelVal}`}
            >
              <span className="col-icon col-grp">{d.icon}</span>
              <span className="col-label col-grp">{d.label}: </span>
              {
                d.value === '' || _.isUndefined(d.value) ?
                  <span className="value-empty col-value col-grp">目前尚無資料</span>
                :
                  <span className="value col-value col-grp">{formatValue(d)}</span>
              }
            </Col>
          ))
        }
      </Row>
    </DataFrame>
  </div>
)};

export default ListView;
