import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import DataFrame from '../../common/DataFrame/index';
import { formatValue, decodeHtml } from '../../../libraries/utils';


const Comp = styled.div`
  font-size: 18px;
`;

const TableContainer = styled.div`
  width: 550px;
`;



const Label = styled.span`

`;

const Value = styled.span`
  display: inline-block;
  padding-left: 20px;
  line-height: 50px;
`;

const ListBullet = styled.img`
  display: inline-block !important;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-right: 10px;
  line-height: -40px;
`;

const ArrayItem = styled.span`
  background-color: #D3EBEB;
  margin-right: 20px;
  padding: 5px 15px;
  border-radius: 5px;
`;




/**
 * @param {Array} templateData Template array for multi type.
 * @param {Array} detailData Template array for multi type.
 * @param {Array} size For slate input.
 * @param {Array} asyncSelectKey
 */

const ListView = ({ isLoading, templateData, detailData, size }) => {
  // console.log('templateData', templateData);
  return (
  <Comp className="list-view-comp">
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
                  <ListBullet alt="list-bullet" src={template.bulletUrl} />
                : null
              }

              {/* Label */}
              <Label>{template.label}： </Label>

              {/* Define different value here */}
              {
                template.type === 'text' || template.type === 'number' ?
                  <Value>{_.get(detailData, template.name, '尚無資料')}</Value>
                : null
              }

              {
                template.type === 'radio' ?
                  <Value>{_.get(detailData, template.radioLabel, '尚無資料')}</Value>
                : null
              }

              {
                template.type === 'select' ?
                  <Value>{_.get(detailData, template.selectLabel, '尚無資料')}</Value>
                : null
              }

              {
                template.type === 'html' ?
                  <Value>{decodeHtml(detailData[template.name])}</Value>
                : null
              }

              {
                template.type === 'markdown' ?
                <ReactMarkdown source={_.get(targetForm, template.name, '尚無資料')} />
                : null
              }

              {
                template.type === 'array' ?
                  <Value>
                    {
                      _.get(detailData, template.name, []).map((arrayItem, index) => (
                        <ArrayItem key={`array-${index}`}>
                          {`${template.custom ? _.get(arrayItem, template.custom.key, '') : arrayItem}`}
                        </ArrayItem>
                      ))
                    }
                  </Value>
                : null
              }
              {
                template.type === 'boolean' ?
                  <Value>
                    { _.get(detailData, template.name) === true || _.get(detailData, template.name) === 'true' ? `${_.get(template, 'custom.trueText', '是')}` : `${_.get(template, 'custom.falseText', '否')}` }
                  </Value>
                : null
              }
              {
                template.type === 'key_value' ?
                  <Value>
                    {
                      _.get(detailData, template.name, []).length > 0 ?
                        _.get(detailData, template.name, []).map((arrayItem, index) => (
                          <ArrayItem key={index}>
                            {`${_.get(arrayItem, "name")} : ${_.get(arrayItem, "port")}`}
                          </ArrayItem>
                        ))
                      : '尚無資料'
                    }
                  </Value>
                : null
              }
              {
                template.unit && _.get(detailData, template.name, "") ?
                  <span>{ template.unit }</span>
                : null
              }
            </Col>
          ))
        }
      </Row>
    </DataFrame>
  </Comp>
)};

export default ListView;
