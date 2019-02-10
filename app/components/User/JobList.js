import React from 'react';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import SectionTitle from '../common/SectionTitle/index';
import DataFrame from '../common/DataFrame/index';
import { groupArray, formatStatus } from '../../libraries/utils';

const JobList = ({ data, addJob, deleteJob }) => (
  <div className="user-job-bg">

    <SectionTitle
      title={'工作清單'}
      subTitle={'以下是您開始的課程中，正在執行的工作內容。'}
      isFloatLeft
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
                  <button className="fl btn-add" onClick={e => addJob(e, obj.data[0].courseId)}>+ 新增</button>
                </Col>
              </Row>
              <div>
                <DataFrame
                  data={obj.data}
                  cols={8}
                >
                  <Row>
                    {
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
                                thumb.service ?
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
                                ) : null
                              }
                            </div>
                            <div className="corner-triangle" />
                          </div>
                        </Col>
                      ))
                    }
                  </Row>
                </DataFrame>
              </div>
            </div>
          )
        )
      }
    </DataFrame>
  </div>
);

export default JobList;
