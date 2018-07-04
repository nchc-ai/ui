import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  courseList: {
    loading: false,
    data: []
  },
  courseDetail: {
    loading: false,
    data: {}
  }
};

export default function Course(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_COURSE_LIST_BY_LEVEL[LOADING]:
    return {
      ...state,
      courseList: {
        ...state.courseList,
        isLoading: true
      }
    };
  case actionTypes.GET_COURSE_LIST_BY_LEVEL[SUCCESS]:
    return {
      ...state,
      courseList: {
        isLoading: false,
        data: action.payload.courses
      }
    };

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
