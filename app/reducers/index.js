import { combineReducers } from 'redux';
import { combineForms, modelReducer } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';

import Auth from './Auth';
import Ui from './Ui';
import Course from './Course';
import User from './User';
import Classroom from './Classroom';

import {
  initialGlobalSearchState,
  initialClassroomState,
  initialCourseConState,
  initialCourseVMState,
  initialProfileState,
} from '../constants/initialState';

const rootReducer = combineReducers({
  forms: combineForms({
    globalSearch: modelReducer('globalSearch', initialGlobalSearchState),
    classroom: modelReducer('classroom', initialClassroomState),
    courseCon: modelReducer('courseCon', initialCourseConState),
    courseVM: modelReducer('courseVM', initialCourseVMState),
    profile: modelReducer('profile', initialProfileState)
  }, 'forms'),
  Auth,
  Classroom,
  Course,
  User,
  Ui
});

export default rootReducer;
