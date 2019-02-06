import { combineReducers } from 'redux';
import { combineForms, modelReducer } from 'react-redux-form';
import { routerReducer } from 'react-router-redux';

import Auth from './Auth';
import Ui from './Ui';
import Course from './Course';
import Job from './Job';
import User from './User';
import Role from './Role';
import Classroom from './Classroom';

import {
  initialGlobalSearchState,
  initialClassroomState,
  initialClassroomCronState,
  initialCourseConState,
  initialCourseVMState,
  initialProfileState,
  initialRoleState,
  initialSnapshotState
} from '../constants/initialState';

const rootReducer = combineReducers({
  forms: combineForms({
    globalSearch: modelReducer('globalSearch', initialGlobalSearchState),
    classroom: modelReducer('classroom', initialClassroomState),
    classroomCron: modelReducer('classroomCron', initialClassroomCronState),
    courseCon: modelReducer('courseCon', initialCourseConState),
    courseVM: modelReducer('courseVM', initialCourseVMState),
    profile: modelReducer('profile', initialProfileState),
    role: modelReducer('role', initialRoleState),
    snapshot: modelReducer('snapshot', initialSnapshotState),
  }, 'forms'),
  Auth,
  Classroom,
  Course,
  Job,
  User,
  Role,
  Ui
});

export default rootReducer;
