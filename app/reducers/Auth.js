import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS, FAIL } from '../constants/apiActions';

const InitialState = {
  loading: false,
  isLogin: false,
  data: [],
  token: '',
  substituation: {
    isSubstituating: true,
    role: '',
    username: '',
    label: {
      value: '',
      label: ''
    }
  },
  userInfo: {
    active: false,
    client_id: '',
    exp: '',
    role: '',
    scope: '',
    token_type: '',
    username: ''
  },
  profile: {
    username: '',
    password: '',
    cName: '',
    company: '',
    'email-1': '',
    'email-2': '',
    phone: '',
    text: ''
  }
};

export default function Auth(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.GET_PROFILE[SUCCESS]:
    return {
      ...state,
      profile: action.payload
    };
  case actionTypes.LOGOUT[SUCCESS]:
    return {
      ...state,
      isLogin: false,
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
      isLogin: true,
      loading: false,
      userInfo: action.payload
    };
  case actionTypes.GET_USER_INFO[FAIL]:
    return {
      ...state,
      isLogin: false,
      loading: false
    };
  case actionTypes.SET_LOGIN_STATE:
    return {
      ...state,
      isLogin: action.isLogin,
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
  case actionTypes.RESET_AUTH:
    return {
      ...state,
      isLogin: false,
      userInfo: InitialState.userInfo
    };
  case actionTypes.TOGGLE_SUBSTITUATING:
    return {
      ...state,
      substituation: {
        ...state.substituation,
        isSubstituating: action.status
      }
    };
  default:
    return state;
  }
}
