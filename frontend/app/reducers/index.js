import { combineReducers } from 'redux';
import { combineForms, modelReducer } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';

import Auth from './Auth';
import Ui from './Ui';
import Course from './Course';
import User from './User';

import {
  initialGlobalSearchState,
  initialAddCourseState,
  initialUserState
} from '../constants/initialState';

const rootReducer = combineReducers({
  forms: combineForms({
    globalSearch: modelReducer('globalSearch', initialGlobalSearchState),
    addCourse: modelReducer('addCourse', initialAddCourseState),
    signup: modelReducer('signup', initialUserState),
    profile: modelReducer('profile', initialUserState)
  }, 'forms'),
  Auth,
  Course,
  User,
  Ui
});

export default rootReducer;
