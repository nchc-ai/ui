import { combineReducers } from 'redux';
import { combineForms, modelReducer } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';

import Auth from './Auth';
import Ui from './Ui';
import Course from './Course';
import Job from './Job';
import Role from './Role';
import Classroom from './Classroom';

import {
  initialSignupState,
  initialGlobalSearchState,
  initialClassroomState,
  initialScheduleState,
  initialCourseConState,
  initialCourseVMState,
  initialProfileState,
  initialPasswordState,
  initialRoleState,
  initialSnapshotState
} from 'constants/initialState';

const rootReducer = combineReducers({
  forms: combineForms({
    signup: modelReducer('signup', initialSignupState),
    globalSearch: modelReducer('globalSearch', initialGlobalSearchState),
    classroom: modelReducer('classroom', initialClassroomState),
    schedule: modelReducer('schedule', initialScheduleState),
    courseCon: modelReducer('courseCon', initialCourseConState),
    courseVM: modelReducer('courseVM', initialCourseVMState),
    profile: modelReducer('profile', initialProfileState),
    password: modelReducer('password', initialPasswordState),
    role: modelReducer('role', initialRoleState),
    snapshot: modelReducer('snapshot', initialSnapshotState),
  }, 'forms'),
  Auth,
  Classroom,
  Course,
  Job,
  Role,
  Ui
});

export default rootReducer;
