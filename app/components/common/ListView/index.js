import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import DataFrame from '../../common/DataFrame/index';
import { formatValue, decodeHtml } from '../../../libraries/utils';

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
                  <img className="list-view__bullet" alt="list-bullet" src={template.bulletUrl} />
                : null
              }

              {/* Label */}
              <span
                className="col-label col-grp"
              >{template.label}： </span>

              {/* Value */}
              {
                _.get(detailData, template.name, "") || _.get(detailData, template.name, []).length > 0 ?
                  <span>
                    {/* Define different value here */}
                    {
                      template.type === 'text' || template.type === 'number' ?
                        <span className="value col-value col-grp">{_.get(detailData, template.name, '')}</span>
                      : null
                    }

                    {
                      template.type === 'radio' ?
                        <span className="value col-value col-grp">{_.get(detailData, template.radioLabel, '')}</span>
                      : null
                    }

                    {
                      template.type === 'select' ?
                        <span className="value col-value col-grp">{_.get(detailData, template.selectLabel, '')}</span>
                      : null
                    }

                    {
                      template.type === 'html' ?
                        <span className="value col-value col-grp">{decodeHtml(detailData[template.name])}</span>
                      : null
                    }

                    {
                      template.type === 'markdown' ?
                      <ReactMarkdown source={_.get(targetForm, template.name)} />
                      : null
                    }

                    {
                      template.type === 'array' ?
                        <span>
                          {
                            detailData[template.name].map((arrayItem, index) => (
                              <span key={index} className="value col-value col-grp">{`${index === 0 ? '' : ' , '} ${arrayItem}`}</span>
                            ))
                          }
                        </span>
                      : null
                    }
                    {
                      template.type === 'boolean' ?
                        <span className="value col-value col-grp">
                          { detailData[template.name] === true || detailData[template.name] === 'true' ? '是' : '否' }
                        </span>
                      : null
                    }
                    {
                      template.type === 'key_value' ?
                        <span>
                          {
                            _.get(detailData, template.name, []).length > 0 ?
                              _.get(detailData, template.name, []).map((arrayItem, index) => (
                                <span key={index} className="value col-value col-grp">{`${index === 0 ? "" : " , "} ${_.get(arrayItem, "name")} : ${_.get(arrayItem, "port")}`}</span>
                              ))
                            : null
                          }
                        </span>
                      : null
                    }
                  </span>
                :
                  <span className="value-empty col-value col-grp">{ template.type === 'number' ? '0' : '目前尚無資料'}</span>
              }
              {
                template.unit && _.get(detailData, template.name, "") ? <span>{ template.unit }</span> : null
              }
            </Col>
          ))
        }
      </Row>
    </DataFrame>
  </div>
)};

export default ListView;
