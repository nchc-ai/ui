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


const Li = styled.div`
  overflow: hidden;
  width: 100%;
  margin-bottom: ${props => props.type == 'multi-select' ? '0px' : '30px'};
`;


const Unit = styled.span`
  padding-left: 10px;
`;

const ValueGroup = styled.div`
  float: left;
  width: 80%;
`;

const Value = styled.div`
  float: left;
  padding-left: 20px;
`;

const EmptyValue = styled(Value)`
  color: #9B9B9B;
`

const ListBullet = styled.img`
  float: left;
  width: 20px;
  height: 20px;
  margin-top: 3px;
  margin-right: 10px;
`;

const Label = styled.span`
  float: left;
`;

const ArrayItem = styled.div`
  float: left;
  background-color: #D3EBEB;
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 0px 15px;
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
      <div>
        {
          templateData.map(template => (
            <Li
              key={template.key}
              md={{ size: size ? 12 / size : 12 }}
              type={template.type}
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
                template.type === 'text' ?
                  <Value>{_.get(detailData, template.name, '尚無資料') || '尚無資料'}</Value>
                : null
              }

              {
                template.type === 'number' ?
                  <Value>{_.get(detailData, template.name, 0)}</Value>
                : null
              }

              {
                template.type === 'single-select' ?
                  <Value>{_.get(detailData, `${template.name}.label`, '尚無資料') || '尚無資料'}</Value>
                : null
              }
              {
                template.type === 'multi-select' ?
                  <Value>
                    {
                      _.get(detailData, template.name, []).length > 0 ?
                        detailData[template.name].map((datum, index) => (
                          <ArrayItem key={`array-${index}`}>{_.get(datum, "label", '')}</ArrayItem>
                        ))
                      : <EmptyValue>尚無資料</EmptyValue>
                    }
                  </Value>
                : null
              }
              {
                template.type === 'html' ?
                  <Value>{decodeHtml(detailData[template.name])}</Value>
                : null
              }

              {
                template.type === 'markdown' ?
                <ReactMarkdown source={_.get(detailData, template.name, '尚無資料')} />
                : null
              }

              {
                template.type === 'ports' ?
                  <Value>
                    {
                      _.get(detailData, template.name, []).length > 0 ?
                        detailData[template.name].map((datum, index) => (
                          <ArrayItem key={`array-${index}`}>
                            {`${_.get(datum, 'name', '')} : ${_.get(datum, 'port', '')}`}
                          </ArrayItem>
                        ))
                      : <EmptyValue>尚無資料</EmptyValue>
                    }
                  </Value>
                : null
              }
              {
                template.type === 'boolean' ?
                  <Value>
                    { _.get(detailData, template.name) === true || _.get(detailData, template.name) === 'true' ?
                      `${_.get(template, 'custom.trueText', '是')}`
                      :
                      `${_.get(template, 'custom.falseText', '否')}`
                    }
                  </Value>
                : null
              }
              {
                template.unit && _.get(detailData, template.name, "") || _.get(detailData, template.name, "") === 0 ?
                  <Unit>{ template.unit }</Unit>
                : null
              }
            </Col>
          ))
        }
      </div>
    </DataFrame>
  </Comp>
)};

export default ListView;
