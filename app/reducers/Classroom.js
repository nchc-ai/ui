import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  list: {
    loading: false,
    data: []
  },
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
  default:
    return state;
  }
}