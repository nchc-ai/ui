import _ from 'lodash';
import * as actionTypes from 'actions/actionTypes';
import { LOADING, SUCCESS, FAIL } from 'constants/apiActions';

const InitialState = {
  status: {
    isCreateContainerCourseLoading: false,
    isUpdateContainerCourseLoading: false,
    isDeleteContainerCourseLoading: false,
    isCreateVMCourseLoading: false,
    isUpdateVMCourseLoading: false,
    isDeleteVMCourseLoading: false
  },
  coursesVM: {
    isLoading: false,
    data: []
  },
  courseCon: {
    isLoading: false,
    data: []
  },
  courseAll: {
    isLoading: false,
    data: []
  },
  courseList: {
    isLoading: false,
    data: []
  },
  courseDetail: {
    isLoading: false,
    data: {}
  },
  searchResult: {
    isLoading: false,
    data: []
  }
};

export default function Course(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.CREATE_CONTAINER_COURSE[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isCreateContainerCourseLoading: true
      }
    };
  case actionTypes.CREATE_CONTAINER_COURSE[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isCreateContainerCourseLoading: false
      }
    };
  case actionTypes.CREATE_CONTAINER_COURSE[FAIL]:
    return {
      ...state,
      status: {
        ...state.status,
        isCreateContainerCourseLoading: false
      }
    };
  case actionTypes.UPDATE_CONTAINER_COURSE[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isUpdateContainerCourseLoading: true
      }
    };
  case actionTypes.UPDATE_CONTAINER_COURSE[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isUpdateContainerCourseLoading: false
      }
    };
  case actionTypes.DELETE_CONTAINER_COURSE[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteContainerCourseLoading: true
      }
    };
  case actionTypes.DELETE_CONTAINER_COURSE[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteContainerCourseLoading: false
      }
    };
    case actionTypes.CREATE_VM_COURSE[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isCreateVMCourseLoading: true
      }
    };
  case actionTypes.CREATE_VM_COURSE[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isCreateVMCourseLoading: false
      }
    };
  case actionTypes.CREATE_VM_COURSE[FAIL]:
    return {
      ...state,
      status: {
        ...state.status,
        isCreateVMCourseLoading: false
      }
    };
  case actionTypes.UPDATE_VM_COURSE[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isUpdateVMCourseLoading: true
      }
    };
  case actionTypes.UPDATE_VM_COURSE[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isUpdateVMCourseLoading: false
      }
    };
  case actionTypes.DELETE_VM_COURSE[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteVMCourseLoading: true
      }
    };
  case actionTypes.DELETE_VM_COURSE[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteVMCourseLoading: false
      }
    };
  case actionTypes.GET_COURSE_LIST_VM[LOADING]:
    return {
      ...state,
      coursesVM: {
        ...state.coursesVM,
        isLoading: true
      }
    };
  case actionTypes.GET_COURSE_LIST_VM[SUCCESS]:
    return {
      ...state,
      coursesVM: {
        isLoading: false,
        data: action.payload.courses
      }
    };
  case actionTypes.GET_COURSE_LIST_CON[LOADING]:
    return {
      ...state,
      courseCon: {
        ...state.courseCon,
        isLoading: true
      }
    };
  case actionTypes.GET_COURSE_LIST_CON[SUCCESS]:
    return {
      ...state,
      courseCon: {
        isLoading: false,
        data: action.payload.courses
      }
    };
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
  case actionTypes.SEARCH_COURSE[FAIL]:
  // console.log('action.payload', action.payload);
    return {
      ...state,
      searchResult: {
        loading: false,
        data: []
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
