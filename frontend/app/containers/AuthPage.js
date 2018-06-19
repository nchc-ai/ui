import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Course from '../components/Course/index';
import CourseList from '../components/Course/CourseList';

class AuthPage extends Component {
  render() {
    return (
      <div className="course-bg global-content">
        <Switch>
          <Route exact path="/login" component={Course} />
          <Route exact path="/signup" component={CourseList} />
        </Switch>
      </div>
    );
  }
}

export default AuthPage;
