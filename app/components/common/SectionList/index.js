import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import DataFrame from '../../common/DataFrame/index';
import { formatValue } from '../../../libraries/utils';

const SectionList = ({ data, detail, col }) => {
  // console.log('data', data);
  return (
  <div className="section-list-comp">
    <Row>
      <div className="section-list-info">
        {detail.info}
      </div>
    </Row>
    <Row>
      {
        data.map(section => (
          <Col
            key={section.key}
            md={{ size: 9, offset: 3 }}
            className={`section-list-section`}
          >
            <h2 className="section-list-title">{section.title}</h2>
            <ul className="section-list-ul">
              {
                section.infos.map((info, index) => (
                  <li key={index} className="section-list-li">
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
        md={{ size: 9, offset: 3 }}
      >
        <a
          href={detail.outerLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          <button className="section-list-btn">
            完整課程簡介請按此下載
          </button>
        </a>
      </Col>
    </Row>
  </div>
)};

export default SectionList;
