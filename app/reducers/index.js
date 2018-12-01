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
  initialAddClassroomState,
  initialCourseConState,
  initialCourseVMState,
  initialUserState,
  initialProfileState,
  initialPasswordState
} from '../constants/initialState';

const rootReducer = combineReducers({
  forms: combineForms({
    globalSearch: modelReducer('globalSearch', initialGlobalSearchState),
    addClassroom: modelReducer('addClassroom', initialAddClassroomState),
    courseCon: modelReducer('courseCon', initialCourseConState),
    courseVM: modelReducer('courseVM', initialCourseVMState),
    signup: modelReducer('signup', initialUserState),
    profile: modelReducer('profile', initialProfileState),
    password: modelReducer('password', initialPasswordState)
  }, 'forms'),
  Auth,
  Classroom,
  Course,
  User,
  Ui
});

export default rootReducer;
