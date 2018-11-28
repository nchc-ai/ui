import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import DataFrame from '../components/common/DataFrame/index';
import { groupArray, formatStatus } from '../libraries/utils';
import CommonPageContent from '../components/CommonPageContent';

class JobPage extends Component {
  componentWillMount() {

  }

  addJob() {
    console.log('add');
    // const {
    //   token,
    //   userInfo,
    //   userAction
    // } = this.props;

    // Progress.show();

    // // console.log('userInfo.username, courseId, token', userInfo.username, courseId, token);
    // userAction.launchJob(userInfo.username, courseId, token, this.onAddJobSuccess);
  }
  
  onAddJobSuccess = () => {
    // this.fetchData();
    // Progress.hide();
    // notify.show('工作新增成功', 'success', 1800);
    // this.props.history.push('/user/job');
  }

  deleteJob() {
    console.log('delete');
    // const {
    //   token,
    //   userAction
    // } = this.props;
    // Progress.show();
    // userAction.deleteJob(thumb.id, token, this.onDeleteJobSuccess);
  }

  onDeleteJobSuccess = () => {
    // this.fetchData();
    // Progress.hide();
    // notify.show('工作刪除成功', 'success', 1800);
  }

  render() {

     const {
      Job,
    } = this.props;
    const data = Job.list;

    return (
      <CommonPageContent
        className="job-page-bg"
        pageTitle="工作清單"
      >
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
                      <button className="fl btn-add" onClick={e => this.addJob(e, obj.data[0].courseId)}>+ 新增</button>
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
                                <button className="btn-cancel" onClick={e => this.deleteJob(e, thumb)}>X</button>
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
      </CommonPageContent>
    )
  }
}

const mapStateToProps = ({ Auth, User, Course }) => ({
  token: Auth.token,
  userInfo: Auth.userInfo,
  Job: {
    loading: User.job.loading,
    list: User.job.data
  },
});

const mapDispatchToProps = dispatch => ({

});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
)(JobPage);
