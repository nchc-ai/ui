import React from 'react';
import { Row, Col } from 'reactstrap';
import SectionTitle from '../common/SectionTitle/index';
import DataFrame from '../common/DataFrame/index';
import { groupArray, formatStatus } from '../../libraries/utils';

const JobList = ({ data, addJob, deleteJob }) => {
  console.log('[JobList] data', groupArray(data, 'name'));
  return (
  <div className="user-job-bg">

    <SectionTitle
      title={'工作清單'}
      subTitle={'以下是您開始的課程中，正在執行的工作內容。'}
    />
    <DataFrame
      data={groupArray(data, 'name')}
      cols={8}
    >
      {
        groupArray(data, 'name').map(
          (obj, i) => (
            <div key={i} className="job-group">
              <Row className="title-row">
                <Col>
                  <h4 className="fl">{obj.group}</h4>
                  <button className="fl btn-add" onClick={e => addJob(e, obj)}>+ 新增</button>
                </Col>
              </Row>
              <Row>
                {
                  obj.data ?
                  obj.data.map((thumb, j) => (
                    <Col key={j} md={4} >
                      <div className="job-card">
                        <button className="btn-cancel" onClick={e => deleteJob(e, thumb)}>X</button>
                        <p className="job-card-status">
                          <span className={`light light-${thumb.status}`} />
                          <span className="status-word">
                            {formatStatus(thumb.status)}
                          </span>
                        </p>
                        <p className="job-card-id">{thumb.id}</p>

                        <div className="job-card-link-li">
                          {
                            thumb.service.map(
                              (service, k) => (
                                <span key={k} className="job-card-link">
                                  <a
                                    href={service.value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {service.label}
                                  </a>
                                  <span className="divide-line">|</span>
                                </span>
                              )
                            )
                          }
                        </div>
                        <div className="corner-triangle" />
                      </div>
                    </Col>
                  ))
                  : null
                }
              </Row>
            </div>
          )
        )
      }
    </DataFrame>
  </div>
)};

export default JobList;
