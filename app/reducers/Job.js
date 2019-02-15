import _ , { map, assign, mapKeys } from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';
import { formatJob } from '../libraries/utils';

const InitialState = {
  container: {
    loading: true,
    data: []
  },
  vm: {
    loading: true,
    data: []
  },
  List: {
    loading: true,
    data: []
  },
  snapshot: {
    isContainerLoading: false,
    isVMLoading: false,
  }
};

// TODO: 在這邊去 format job
export default function Job(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_CON_JOB_LIST[LOADING]:
    return {
      ...state,
      container: {
        ...state.container,
        loading: true
      },
      List: {
        ...state.List,
        loading: true
      }
    };
  case actionTypes.UPDATE_CON_JOB_LIST[LOADING]:
    return {
      ...state,
      container: {
        ...state.container,
        loading: false
      },
      List: {
        ...state.List,
        loading: false
      }
    };
  case actionTypes.GET_CON_JOB_LIST[SUCCESS]:
    const recievedConData = _.map(action.payload.jobs, d => formatJob(d, 'CONTAINER'));

    return {
      ...state,
      container: {
        loading: false,
        data: recievedConData
      },
      List: {
        ...state.List,
        loading: state.vm.loading,
        data: _.unionBy(state.vm, recievedConData, 'id')
      }
    };
  case actionTypes.GET_VM_JOB_LIST[LOADING]:
    return {
      ...state,
      vm: {
        ...state.vm,
        loading: true
      },
      List: {
        ...state.List,
        loading: true
      }
    };
  case actionTypes.UPDATE_VM_JOB_LIST[LOADING]:
    console.log('here');
    return {
      ...state,
      vm: {
        ...state.vm,
        loading: false
      },
      List: {
        ...state.List,
        loading: false
      }
    };
  case actionTypes.GET_VM_JOB_LIST[SUCCESS]:
    const recievedVMData = _.map(action.payload.jobs, d => formatJob(d, 'VM'));
    const loadingVM = false;

    return {
      ...state,
      vm: {
        loading: false,
        data: recievedVMData
      },
      List: {
        ...state.List,
        loading: state.container.loading,
        data: _.unionBy(state.container, recievedVMData, 'id')
      }
    };
  case actionTypes.SNAPSHOT_CONTAINER_JOB[LOADING]:
    return {
      ...state,
      snapshot: {
        ...state.snapshot,
        isContainerLoading: true
      }
    };
  case actionTypes.SNAPSHOT_CONTAINER_JOB[SUCCESS]:
    return {
      ...state,
      snapshot: {
        ...state.snapshot,
        isContainerLoading: false
      }
    };
  case actionTypes.SNAPSHOT_VM_JOB[LOADING]:
    return {
      ...state,
      snapshot: {
        ...state.snapshot,
        isVMLoading: true
      }
    };
  case actionTypes.SNAPSHOT_VM_JOB[SUCCESS]:
    return {
      ...state,
      snapshot: {
        ...state.snapshot,
        isVMLoading: false
      }
    };
  default:
    return state;
  }
}
