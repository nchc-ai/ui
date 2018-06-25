import { combineReducers } from 'redux';
import { combineForms, modelReducer } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';

import Auth from './Auth';
import Ui from './Ui';
import User from './User';

import {
  initialGlobalSearchState,
  initialAddCourseState
} from '../constants/initialState';

const rootReducer = combineReducers({
  forms: combineForms({
    globalSearch: modelReducer('globalSearch', initialGlobalSearchState),
    addCourse: modelReducer('addCourse', initialAddCourseState)
  }, 'forms'),
  Auth,
  User,
  Ui
});

export default rootReducer;
