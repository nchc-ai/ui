import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Form, Control, Errors, actions as formActions } from 'react-redux-form';
import { notify } from "react-notify-toast";
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import SideMenu from '../components/SideMenu/index';
import TableList from '../components/common/TableList/index';
import FormGroups from '../components/common/FormGroups/index';
import { userCourseData } from '../constants/tableData';
import { addCourseForm } from '../constants/formsData';
import FormButtons from '../components/common/FormButtons/index';
import HeaderBlock from '../components/common/HeaderBlock/index';

class UserPage extends Component {
  componentWillMount() {
    const {
      userAction,
      token
    } = this.props;
    userAction.getCourseList('jimmy', token);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // const token = getToken();
    // console.log('token', token);
    // this.props.userAction.getCourseList('jimmy', token);    
  }


  handleSubmitFailed = (formData) => {
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  handleSubmit = (formData) => {
    console.log('submit');
    // this.props.authAction.manualLogin(user, this.afterLogin);
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
                  <Col>課程列表</Col>
                  <Col>
                    <Link to="/user/course/add"><button>+ 新增 </button></Link>
                  </Col>
                </Row>
                <TableList
                  data={Course.list}
                  tableData={userCourseData}
                />

              </div>
            </Route>
            
            <Route exact path="/user/course/add">
              <div className="user-course-edit-bg">
                {/* TODO: FormGroups */}
                <Form
                  model="forms.addCourse"
                  className="add-course-comp"
                  onSubmit={formData => this.handleSubmit(formData)}
                  onSubmitFailed={formData => this.handleSubmitFailed(formData)}
                >
                 
                  <FormGroups
                    formData={addCourseForm}
                    targetForm={addCourse}
                    changeVal={changeValue}
                  />

                  <HeaderBlock headerArr={['容器範本']}>
                    <FormGroups
                      formData={addCourseForm}
                      targetForm={addCourse}
                      changeVal={changeValue}
                    />
                  </HeaderBlock>

                  {/* 下方按鈕 */}
                  <FormButtons
                    cancelName="取消"
                    submitName="上傳"
                    backMethod={this.cancelEdit}
                    resetMethod={this.resetEdit}
                    isReset
                  />

                </Form>

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
