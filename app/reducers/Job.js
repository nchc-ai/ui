import _ , { map, assign, mapKeys } from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';
import { formatJob } from '../libraries/utils';

const InitialState = {
  ListCon: {
    loading: true,
    data: []
  },
  ListVM: {
    loading: true,
    data: []
  },
  List: {
    loading: true,
    data: []
  }
};

// TODO: 在這邊去 format job
export default function Job(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_CON_JOB_LIST[LOADING]:
    return {
      ...state,
      ListCon: {
        ...state.ListCon,
        loading: true
      },
      List: {
        ...state.List,
        loading: true
      }
    };
  case actionTypes.GET_CON_JOB_LIST[SUCCESS]:
    const recievedConData = _.map(action.payload.jobs, d => formatJob(d));
    const loadingCon = false;

    return {
      ...state,
      ListCon: {
        loading: false,
        data: recievedConData
      },
      List: {
        ...state.List,
        loading: state.ListVM.loading,
        data: _.unionBy(state.ListVM, recievedConData, 'id')
      }
    };
  case actionTypes.GET_VM_JOB_LIST[LOADING]:
    return {
      ...state,
      ListVM: {
        ...state.ListVM,
        loading: true
      },
      List: {
        ...state.List,
        loading: true
      }
    };
  case actionTypes.GET_VM_JOB_LIST[SUCCESS]:
    const recievedVMData = _.map(action.payload.jobs, d => formatJob(d));
    const loadingVM = false;

    return {
      ...state,
      ListVM: {
        loading: false,
        data: recievedVMData
      },
      List: {
        ...state.List,
        loading: state.ListCon.loading,
        data: _.unionBy(state.ListCon, recievedVMData, 'id')
      }
    };
  default:
    return state;
  }
}
