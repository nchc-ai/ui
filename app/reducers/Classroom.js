import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  list: {
    isLoading: false,
    data: []
  },
  detail: {
    isLoading: false,
    data: {}
  },
  groups: {
    isLoading: false,
    data: []
  }
};


export default function Classroom(state = InitialState, action) {
  switch (action.type) {

  case actionTypes.GET_CLASSROOM_LIST[LOADING]:
    return {
      ...state,
      list: {
        ...state.list,
        isLoading: true
      }
    };
  case actionTypes.GET_CLASSROOM_LIST[SUCCESS]:
    return {
      ...state,
      list: {
        isLoading: false,
        data: action.payload.classrooms
      }
    };
  case actionTypes.GET_CLASSROOM_DETAIL[LOADING]:
    return {
      ...state,
      detail: {
        ...state.detail,
        isLoading: true
      }
    };
  case actionTypes.GET_CLASSROOM_DETAIL[SUCCESS]:
    return {
      ...state,
      detail: {
        isLoading: false,
        data: action.payload.classroom
      }
    };
  case actionTypes.GET_CLASSROOM_GROUPS[LOADING]:
    return {
      ...state,
      groups: {
        ...state.groups,
        isLoading: true
      }
    };
  case actionTypes.GET_CLASSROOM_GROUPS[SUCCESS]:
    return {
      ...state,
      groups: {
        isLoading: false,
        data: action.payload.classrooms
      }
    };
  default:
    return state;
  }
}