import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';
import { Form, Control, Errors, actions as formActions } from 'react-redux-form';
import { notify } from "react-notify-toast";
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import SideMenu from '../components/SideMenu/index';
import TableList from '../components/common/TableList/index';
import FormGroups from '../components/common/FormGroups/index';
import { userCourseData } from '../constants/tableData';
import { addCourseForm, addCourseContainerOneForm, addCourseContainerTwoForm } from '../constants/formsData';
import FormButtons from '../components/common/FormButtons/index';
import HeaderBlock from '../components/common/HeaderBlock/index';
import { jobs } from '../constants/tempData';
import { groupArray } from '../libraries/utils';
import SectionTitle from '../components/common/SectionTitle/index';

class UserPage extends Component {
  componentWillMount() {
    const {
      userAction,
      token
    } = this.props;
    userAction.getCourseList('jimmy', token);

    userAction.getDatasetsOpts();

    userAction.getJobList('jimmy', token);

    console.log('jobs', jobs, groupArray(jobs, 'name'));
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // const token = getToken();
    // console.log('token', token);
    // this.props.userAction.getCourseList('jimmy', token);    
  }


  handleSubmitFailed = (formData) => {
    console.log('formData', formData);
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  handleSubmit = (formData) => {
    console.log('submit', formData);

    const {
      userAction,
      token
    } = this.props;

    userAction.createCourse(token, formData);
  }

  resetEdit = () => {
    // this.props.uiAction.openResetDialog(types.ITEMS);
  }

  cancelEdit = () => {
    // const groupType = _.get(this.props.match, 'params.groupType');
    // if (groupType) {
    //   this.props.history.push('/manage/cate');
    // } else {
    //   this.props.history.push(`/manage/${this.props.match.params.type}`);
    // }
  }

  render() {
    const {
      match,
      Course,
      addCourse,
      changeValue
    } = this.props;
    
    return (
      <div id="page-wrap" className="user-bg global-content">
       
        <div className="side-menu-wrap fl">
          <SideMenu
            match={match}
          />
        </div>
        <div className="fl user-container">
          <Switch>
            {/* 課程列表 */}
            <Route exact path="/user/course">
              <div className="user-course-bg">
                <Row>
                  <Col>
                    <h1>課程列表</h1>
                  </Col>
                  <Col>
                    <Link to="/user/course/add">
                      <span className="v-helper" />
                      <button className="btn-pair add-btn">+ 新增 </button>
                    </Link>
                  </Col>
                </Row>
                <TableList
                  data={Course.list}
                  tableData={userCourseData}
                />

              </div>
            </Route>
            {/* 新增課程 */}
            <Route exact path="/user/course/add">
              <div className="user-course-edit-bg">


                <h1>新增課程</h1>
                
                <Form
                  model="forms.addCourse"
                  className="add-course-comp"
                  onSubmit={formData => this.handleSubmit(formData)}
                  onSubmitFailed={formData => this.handleSubmitFailed(formData)}
                >
                  <Row>
                    <Col md={5}>
                      <FormGroups
                        formData={addCourseForm}
                        targetForm={addCourse}
                        changeVal={changeValue}
                      />
                    </Col>
                  </Row>
                  
                  {/* 下方按鈕 */}
                  <FormButtons
                    cancelName="上一頁"
                    submitName="儲存"
                    backMethod={this.cancelEdit}
                  />

                </Form>

              </div>
            </Route>

            {/* 課程細項 */}
            <Route exact path="/user/course/:courseId">
              <div className="user-course-edit-bg">


                <h1>課程細項</h1>
                
                
                  
                {/* 下方按鈕 */}
                <FormButtons
                  cancelName="上一頁"
                  submitName="開始課程"
                  backMethod={this.cancelEdit}
                />


              </div>
            </Route>

            {/* 工作清單 */}
            <Route exact path="/user/job">
              <div className="user-job-bg">

                <SectionTitle
                  title={'工作清單'}
                  subTitle={'以下是您開始的課程中，正在執行的工作內容。'}
                />
                
                {
                  groupArray(jobs, 'name').map(
                    (obj, i) => (
                      <div key={i} className="job-group">
                        <h4>{obj.group}</h4>
                        <Row>
                          {
                            obj.data.map((thumb, j) => (
                              <Col key={j} md={4} >
                                <div className="job-card">
                                  <button className="btn-cancel">X</button>
                                  <p className="job-card-status">
                                    <span className={`light light-${thumb.status}`} />
                                    {thumb.status}
                                  </p>
                                  <p className="job-card-id">{thumb.id}</p>
                                  {
                                    thumb.service.map(
                                      (service, k) => (
                                        <span>
                                          <a key={k} href={service.value}>
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
            </Route>

          </Switch>
        </div>
        
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(formActions.reset('forms.addCourse')),
  changeValue: (value, target) => dispatch(formActions.change(
    `forms.addCourse.${target}`,
    value
  ))
});

const mapStateToProps = ({ Auth, User, forms }) => ({
  addCourse: forms.addCourse,
  token: Auth.token,
  Course: {
    loading: User.course.loading,
    list: User.course.data
  }
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc
)(UserPage);
