import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import CourseIntro from '../components/Course/CourseIntro';
import CourseList from '../components/Course/CourseList';
import { courseList } from '../constants/fakeData';
import { courseData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class CoursePage extends Component {

  componentWillMount() {
    // this.props.userAction.getCourseList('jimmy', token)
  }

  render() {
    const {
      match
    } = this.props;
    const courseType = _.get(match, 'params.type');
    return (
      <div className="course-bg global-content">
        <Switch>
          <Route exact path="/course/:type">
            <CourseList
              match={match}
              data={courseList}
              tableData={courseData}
              courseType={courseType}
            />
          </Route>
          <Route exact path="/course" component={CourseIntro} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth }) => ({
  token: Auth.token
});


export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
  withRouter
)(CoursePage);
