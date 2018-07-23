import _ from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  courseAll: {
    loading: false,
    data: []
  },
  courseList: {
    loading: false,
    data: []
  },
  courseDetail: {
    loading: false,
    data: {}
  },
  searchResult: {
    loading: false,
    data: []
  }
};

export default function Course(state = InitialState, action) {
  switch (action.type) {

  case actionTypes.GET_COURSE_LIST_ALL[LOADING]:
    return {
      ...state,
      courseAll: {
        ...state.courseAll,
        isLoading: true
      }
    };
  case actionTypes.GET_COURSE_LIST_ALL[SUCCESS]:
    return {
      ...state,
      courseAll: {
        isLoading: false,
        data: action.payload.courses
      }
    };
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
  case actionTypes.SEARCH_COURSE[LOADING]:
    return {
      ...state,
      searchResult: {
        ...state.courseList,
        isLoading: true
      }
    };
  case actionTypes.SEARCH_COURSE[SUCCESS]:
    return {
      ...state,
      searchResult: {
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
