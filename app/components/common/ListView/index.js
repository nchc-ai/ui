import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import DataFrame from '../../common/DataFrame/index';
import { formatValue } from '../../../libraries/utils';

/**
 * @param {Array} templateData Template array for multi type.
 * @param {Array} detailData Template array for multi type.
 * @param {Array} size For slate input.
 * @param {Array} asyncSelectKey
 */

const ListView = ({ isLoading, templateData, detailData, size }) => {
  // console.log('templateData', templateData);
  return (
  <div className="list-view-comp">
    <DataFrame
      isLoading={isLoading}
      data={templateData}
      cols={8}
    >
      <Row>
        {
          templateData.map(template => (
            <Col
              key={template.key}
              md={{ size: size ? 12 / size : 12 }}
              className={`list-view-li list-view-li-${template.name}`}
            >
              {/* Bullet */}
              {
                _.get(template, 'bulletUrl', "") ?
                  <img alt="" src={template.bulletUrl} />
                : null
              }

              {/* Label */}
              <span className="col-label col-grp">{template.label}: </span>

              {/* Value */}
              {
                _.get(detailData, template.name, "") ?
                  <span>
                    {/* Define different value here */}
                    {
                      template.type === 'text' ?
                        <span className="value col-value col-grp">{detailData[template.name]}</span>
                      : null
                    }

                    {
                      template.type === 'array' ?
                        <span>
                          {
                            detailData[template.name].map(arrayItem => (
                              <span className="value col-value col-grp">{arrayItem}</span>
                            ))
                          }
                        </span>
                      : null
                    }
                    {
                      template.type === 'key_value' ?
                        <span>
                          {
                            detailData[template.name].map(arrayItem => (
                              <span className="value col-value col-grp">{`${arrayItem.name} : ${arrayItem.port}`}</span>
                            ))
                          }
                        </span>
                      : null
                    }
                    {
                      template.unit ?
                        <span>
                          { template.unit }
                        </span>
                      : null
                    }
                  </span>
                :
                  <span className="value-empty col-value col-grp">目前尚無資料</span>
              }
            </Col>
          ))
        }
      </Row>
    </DataFrame>
  </div>
)};

export default ListView;
