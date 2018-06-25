import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';
import { courses } from '../libraries/utils';

const InitialState = {
  course: {
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
  default:
    return state;
  }
}
