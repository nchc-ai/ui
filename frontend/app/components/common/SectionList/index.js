import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import DataFrame from '../../common/DataFrame/index';
import { formatValue } from '../../../libraries/utils';

const SectionList = ({ data, detail, col }) => {
  console.log('data', data);
  return (
  <div className="section-list-comp">
    <Row>
      <div className="info">
        {detail.info}
      </div>
    </Row>
    <Row>
      {
        data.map(section => (
          <Col
            key={section.key}
            md={{ size: 8, offset: 4 }}
            className={`section-list-section`}
          >
            <h2 className="section-list-title">{section.title}</h2>
            <ul className="section-list-ul">
              { 
                section.infos.map(info => (
                  <li  className="section-list-li">
                    <span className="v-helper" />
                    <span
                      className="section-list-deco"
                      style={{ opacity: info.isRequired ? 1 : 0 }}
                    >
                      必修
                    </span>
                    <span className="section-list-li-word">{info.value}</span>
                  </li>
                ))
              }
            </ul>
          </Col>
        ))
      }
    </Row>
    <Row>
      <Col
        md={{ size: 8, offset: 4 }}
      >
        <a
          href={detail.outerLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          <button>
            完整課程簡介請下載
          </button>
        </a>
      </Col>
    </Row>
  </div>
)};

export default SectionList;
