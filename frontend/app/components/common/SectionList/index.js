import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import DataFrame from '../../common/DataFrame/index';
import { formatValue } from '../../../libraries/utils';
import { basicCourseList } from '../../../constants/listData';

const SectionList = ({ data, col }) => {
  console.log('data', data);
  return (
  <div className="section-list-comp">
    <Row>
      {
        data.map(section => (
          <Col
            key={section.key}
            md={{ size: 12 }}
            className={`section-list-section`}
          >
            <h2 className="section-list-title">{section.title}</h2>
            <ul>
              { 
                section.infos.map(info => (
                  <li>
                    <span
                      className="section-list-deco"
                      style={{ display: info.isRequired ? 'block' : 'none' }}
                    >
                      必修
                    </span>
                    <p className="section-list-li-word">{info.value}</p>
                  </li>
                ))
              }
            </ul>
          </Col>
        ))
      }
    </Row>
  </div>
)};

export default SectionList;
