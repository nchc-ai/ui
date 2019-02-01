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
  publicList: {
    isLoading: false,
    data: []
  },
  students: {
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
  case actionTypes.GET_PUBLIC_CLASSROOMS[LOADING]:
    return {
      ...state,
      publicList: {
        ...state.publicList,
        isLoading: true
      }
    };
  case actionTypes.GET_PUBLIC_CLASSROOMS[SUCCESS]:
    return {
      ...state,
      publicList: {
        isLoading: false,
        data: action.payload.classrooms
      }
    };
  case actionTypes.UPLOAD_STUDENTS_CSV[LOADING]:
    return {
      ...state,
      students: {
        ...state.students,
        isLoading: true
      }
    };
  case actionTypes.UPLOAD_STUDENTS_CSV[SUCCESS]:

    const data = action.payload.users.map((d, i) => ({ keyItem: `${i + 1}`, valueItem: d }))
    return {
      ...state,
      students: {
        isLoading: false,
        data
      }
    };
  case actionTypes.RESET_STUDENTS_FIELD:
    return {
      ...state,
      students: {
        isLoading: false,
        data: []
      }
    };
  case actionTypes.SET_STUDENTS_FIELD:
    return {
      ...state,
      students: {
        isLoading: false,
        data: action.students
      }
    };
  default:
    return state;
  }
}
