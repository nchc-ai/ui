import _ , { map, assign, mapKeys } from 'lodash';
import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';
import { formatJob } from '../libraries/utils';

const InitialState = {
  ListCon: {
    loading: false,
    data: []
  },
  ListVM: {
    loading: false,
    data: []
  },
  List: {
    loading: false,
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
    return {
      ...state,
      ListCon: {
        loading: false,
        data: _.map(action.payload.jobs, d => formatJob(d))
      },
      List: {
        ...state.List,
        loading: false,
        data: _.unionBy(state.ListCon, state.ListVM, 'id')
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
    return {
      ...state,
      ListVM: {
        loading: false,
        data: _.map(action.payload.jobs, d => formatJob(d))
      },
      List: {
        ...state.List,
        loading: false,
        data: _.unionBy(state.ListCon, state.ListVM, 'id')
      }
    };
  default:
    return state;
  }
}
