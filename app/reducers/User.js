import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';
import { courses, jobs } from '../libraries/backToFront';

const InitialState = {
  course: {
    loading: false,
    data: []
  },
  job: {
    loading: false,
    data: []
  }
};

export default function User(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_USER_COURSE_LIST[LOADING]:
    return {
      ...state,
      course: {
        ...state.course,
        isLoading: true
      }
    };
  case actionTypes.GET_USER_COURSE_LIST[SUCCESS]:
    return {
      ...state,
      course: {
        isLoading: false,
        data: _.map(action.payload.courses, d => courses(d))
      }
    };
  case actionTypes.GET_JOB_LIST[LOADING]:
    return {
      ...state,
      job: {
        ...state.job,
        loading: true
      }
    };
  case actionTypes.GET_JOB_LIST[SUCCESS]:
    return {
      ...state,
      job: {
        loading: false,
        data: _.map(action.payload.jobs, d => jobs(d))
      }
    };
  default:
    return state;
  }
}
