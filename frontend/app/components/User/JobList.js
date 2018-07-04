import React from 'react';
import { Row, Col } from 'reactstrap';
import SectionTitle from '../common/SectionTitle/index';
import { groupArray } from '../../libraries/utils';

const JobList = ({ data }) => (
  <div className="user-job-bg">

    <SectionTitle
      title={'工作清單'}
      subTitle={'以下是您開始的課程中，正在執行的工作內容。'}
    />

    {
      groupArray(data, 'name').map(
        (obj, i) => (
          <div key={i} className="job-group">
            <h4>{obj.group}</h4>
            <Row>
              {
                obj.data.map((thumb, j) => (
                  <Col key={j} md={4} >
                    <div className="job-card">
                      <button className="btn-cancel" onClick={e => this.deleteJob(e, thumb)}>X</button>
                      <p className="job-card-status">
                        <span className={`light light-${thumb.status}`} />
                        {thumb.status}
                      </p>
                      <p className="job-card-id">{thumb.id}</p>
                      {
                        thumb.service.map(
                          (service, k) => (
                            <span key={k}>
                              <a href={service.value}>
                                {service.label}
                              </a>
                              <span>|</span>
                            </span>
                          )
                        )
                      }
                    </div>
                  </Col>
                ))
              }
            </Row>
          </div>
        )
      )
    }

</div>
);

export default JobList;
