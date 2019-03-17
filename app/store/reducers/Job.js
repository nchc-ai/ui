import _ , { map, assign, mapKeys } from 'lodash';
import * as actionTypes from 'actions/actionTypes';
import { LOADING, SUCCESS, FAIL } from 'constants/apiActions';
import { formatJob } from '../../libraries/utils';

const InitialState = {
  status: {
    isLaunchJobLoading: false,
    isDeleteJobLoading: false
  },
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
  },
  doubleList: [
    {
      title: '容器課程',
      type: 'container',
      loading: false,
      data: []
    }, {
      title: 'VM課程',
      type: 'vm',
      loading: false,
      data: []
    }
  ]
};

// TODO: 在這邊去 format job
export default function Job(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.LAUNCH_COURSE_JOB[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isLaunchJobLoading: true
      },
    };
  case actionTypes.LAUNCH_COURSE_JOB[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isLaunchJobLoading: false
      },
    };
  case actionTypes.LAUNCH_COURSE_JOB[FAIL]:
    return {
      ...state,
      status: {
        ...state.status,
        isLaunchJobLoading: false
      },
    };
  case actionTypes.DELETE_JOB[LOADING]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteJobLoading: true
      },
    };
  case actionTypes.DELETE_JOB[SUCCESS]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteJobLoading: false
      },
    };
  case actionTypes.DELETE_JOB[FAIL]:
    return {
      ...state,
      status: {
        ...state.status,
        isDeleteJobLoading: false
      },
    };
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
      },
      doubleList: [
        {
          ...state.doubleList[0],
          loading: true
        }, {
          ...state.doubleList[1]
        }
      ]
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
      },
      doubleList: [
        {
          ...state.doubleList[0],
          loading: false,
          data: recievedConData
        }, {
          ...state.doubleList[1]
        }
      ]
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
      },
      doubleList: [
        {
          ...state.doubleList[0],
          loading: false
        }, {
          ...state.doubleList[1]
        }
      ]
    };
  case actionTypes.UPDATE_CON_JOB_LIST[SUCCESS]:
    const recievedUpdateConData = _.map(action.payload.jobs, d => formatJob(d, 'CONTAINER'));

    return {
      ...state,
      container: {
        loading: false,
        data: recievedUpdateConData
      },
      List: {
        ...state.List,
        loading: state.vm.loading,
        data: _.unionBy(state.vm, recievedUpdateConData, 'id')
      },
      doubleList: [
        {
          ...state.doubleList[0],
          loading: false,
          data: recievedUpdateConData
        }, {
          ...state.doubleList[1]
        }
      ]
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
      },
      doubleList: [
        {
          ...state.doubleList[0]
        }, {
          ...state.doubleList[1],
          loading: true
        }
      ]
    };
  case actionTypes.UPDATE_VM_JOB_LIST[LOADING]:
    return {
      ...state,
      vm: {
        ...state.vm,
        loading: false
      },
      List: {
        ...state.List,
        loading: false
      },
      doubleList: [
        {
          ...state.doubleList[0]
        }, {
          ...state.doubleList[1],
          loading: false
        }
      ]
    };
  case actionTypes.GET_VM_JOB_LIST[SUCCESS]:
    const recievedVMData = _.map(action.payload.jobs, d => formatJob(d, 'VM'));

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
      },
      doubleList: [
        {
          ...state.doubleList[0]
        }, {
          ...state.doubleList[1],
          loading: false,
          data: recievedVMData
        }
      ]
    };
  case actionTypes.UPDATE_VM_JOB_LIST[SUCCESS]:
    const recievedUpdateVMData = _.map(action.payload.jobs, d => formatJob(d, 'VM'));
    return {
      ...state,
      vm: {
        loading: false,
        data: recievedUpdateVMData
      },
      List: {
        ...state.List,
        loading: state.container.loading,
        data: _.unionBy(state.container, recievedUpdateVMData, 'id')
      },
      doubleList: [
        {
          ...state.doubleList[0]
        }, {
          ...state.doubleList[1],
          loading: false,
          data: recievedUpdateVMData
        }
      ]
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
