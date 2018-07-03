import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  courseDetail: {
    loading: false,
    data: {}
  }
};

export default function Course(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_COURSE_DETAIL[LOADING]:
    return {
      ...state,
      courseDetail: {
        ...state.course,
        isLoading: true
      }
    };
  case actionTypes.GET_COURSE_DETAIL[SUCCESS]:
    return {
      ...state,
      courseDetail: {
        isLoading: false,
        data: action.payload.course
      }
    };
  default:
    return state;
  }
}
