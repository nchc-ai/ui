import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS } from '../constants/apiActions';

const InitialState = {
  loading: false,
  isLogin: false,
  data: [],
  token: '',
  steady: true,
  userInfo: {
    active: false,
    client_id: '',
    exp: '',
    role: '',
    scope: '',
    token_type: '',
    username: ''
  }
};

export default function Auth(state = InitialState, action) {
  switch (action.type) {
  
  case actionTypes.LOGOUT:
    return {
      ...state,
      userInfo: InitialState.userInfo
    };
  case actionTypes.GET_USER_INFO[LOADING]:
    return {
      ...state,
      loading: true
    };
  case actionTypes.GET_USER_INFO[SUCCESS]:
    return {
      ...state,
      steady: true,
      userInfo: action.payload
    };
  case actionTypes.SET_USER_INFO:
    return {
      ...state,
      isLogin: action.isLogin,
      userInfo: {
        ...state.userInfo,
        ...action.userInfo
      }
    };
  case actionTypes.SET_USER_TOKEN:
    return {
      ...state,
      isLogin: action.isLogin,
      token: action.token
    };
  default:
    return state;
  }
}
