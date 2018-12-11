import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  List: {
    loading: false,
    data: []
  }
};

export default function Job(state = InitialState, action) {
  switch (action.type) {
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
