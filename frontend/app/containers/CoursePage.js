import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Course from '../components/Course/index';
import CourseList from '../components/Course/CourseList';

class CoursePage extends Component {
  render() {
    const {
      match
    } = this.props;
    // console.log('match', match);
    return (
      <div className="course-bg global-content">
        <Switch>
          <Route exact path="/course/:type">
            <CourseList
              match={match}
            />
          </Route>
          <Route exact path="/course" component={Course} />
        </Switch>
      </div>
    );
  }
}

export default (withRouter(CoursePage));
