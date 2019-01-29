import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Auth from '../actions/Auth';
import * as Classroom from '../actions/Classroom';
import * as Course from '../actions/Course';
import * as Job from '../actions/Job';
import * as User from '../actions/User';
import * as Role from '../actions/Role';
import * as Ui from '../actions/Ui';

export default function enableBatching(reducer) {
  return function batchingReducer(state, action) {
    switch (action.type) {
    case 'BATCH_ACTIONS':
      return action.actions.reduce(batchingReducer, state);
    default:
      return reducer(state, action);
    }
  }
}
