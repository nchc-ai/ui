import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

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
    console.log('action.payload', action.payload);
    return {
      ...state,
      course: {
        isLoading: false,
        data: action.payload.course
      }
    };
  default:
    return state;
  }
}
