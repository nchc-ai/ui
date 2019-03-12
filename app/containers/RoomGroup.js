import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'components/common/NotifyToast';
import TableList from '../components/common/TableList';
import ListView from '../components/common/ListView/index';
import { Form, actions as formActions } from 'react-redux-form';
import bindActionCreatorHOC from '../libraries/bindActionCreatorHOC';
import DataFrame from '../components/common/DataFrame/index';
import CommonPageContent from '../components/CommonPageContent'
import { classroomGroupData } from '../constants/tableData';
import { classroomGroupTpl } from '../constants/listData';
import ReactMarkdown from 'react-markdown';
import bindProgressBarHOC from 'libraries/bindProgressBarHOC';
import bindDialogHOC from 'libraries/bindDialogHOC';
import * as dialogTypes from 'constants/dialogTypes';
import { TOAST_TIMING } from '../constants';

class RoomGroup extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
    }
  }

  fetchData = (nextProps) => {
    const {
      roomAction,
      token,
      userInfo
    } = nextProps;
    if (token) {
      roomAction.getClassroomList({
        token,
        userInfo,
        next: () => {

        }
      });
    } else {
      notify.show('您 token 有誤，請重新登入', 'error', TOAST_TIMING);
    }
  }

  /**
   * Launch course job.
   * @param {Object} e - .
   * @param {Object} data - .
   */
  launchCourseJob = (e, data) => {
    const {
      token,
      history,
      jobAction,
      myUserInfo,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog
    } = this.props;

    openCustomDialog({
      type: dialogTypes.CREATE,
      title: '開始課程',
      info: '請問確定要開始此課程嗎？',
      submitMethod: () => {
        toggleDialog();
        startProgressBar();

        jobAction.launchCourseJob({
          user: myUserInfo.username,
          classroomId: data.roomId,
          courseId: data.id,
          token,
          next: (isSuccess) => {
            endPorgressBar();
            if (isSuccess) {
              history.push('/user/job/list');
              notify.show('已發出啟動課程訊號', 'success', TOAST_TIMING);
            }
          }
        });
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
  }

  render() {
    const {
      match,
      courseList,
      courseDetail,
      searchResult,
      addClassroom,
      roomList
    } = this.props;
    const courseType = _.get(match, 'params.type');

    return (
      <CommonPageContent
        className="role-page-bg"
        pageTitle="教室列表"
      >
        <DataFrame
          isLoading={roomList.isLoading}
          data={roomList.data}
          cols={8}
        >
        <div className="classroom-group-comp">
          {
            roomList.data.map((classroom, index) => (
              <div key={index} className="classroom-card">
                <div className="classroom-info">
                  <h3 className="classroom-name">{classroom.name}</h3>
                  <ReactMarkdown source={_.get(classroom, 'description')} />
                  <ListView
                    templateData={classroomGroupTpl}
                    detailData={classroom}
                  />
                </div>
                <div className="course-list">
                  {
                    classroom.courseInfo ?
                      <TableList
                        data={classroom.courseInfo}
                        tableData={classroomGroupData}
                        isLoading={false}
                        isDialogOpen={true}
                        startMethod={this.launchCourseJob}
                        editMethod={this.editCourse}
                        deleteMethod={this.deleteCourse}
                        actionMode="start_only"
                      />
                    : null
                  }
                </div>
              </div>
            ))
          }
        </div>
        </DataFrame>
      </CommonPageContent>
    );
  }
}

const mapStateToProps = ({ Auth, Role, Course, forms, Classroom }) => ({
  addClassroom: forms.addClassroom,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  myUserInfo: Auth.userInfo,
  courseList: Course.courseList.data,
  courseDetail: Course.courseDetail.data,
  searchResult: Course.searchResult.data,
  roomList: {
    isLoading: Classroom.list.isLoading,
    data: Classroom.list.data
  }
});

const mapDispatchToProps = dispatch => ({
  resetForm: targetForm => dispatch(formActions.reset(`forms.${targetForm}`))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHOC,
  bindProgressBarHOC,
  bindDialogHOC,
  withRouter
)(RoomGroup);
