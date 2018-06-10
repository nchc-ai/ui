import * as actionTypes from '../actions/actionTypes';

const InitialState = {
  loading: false,
  isLogin: false,
  data: [],
  userInfo: {
    email: '',
    username: '',
    nickName: '',
    gender: '',
    birthday: '',
    mobile: '',
    tel: '',
    address: '',
    selfIntro: ''
  }
};

export default function Auth(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.SET_USER_INFO:
    return {
      ...state,
      isLogin: action.isLogin,
      userInfo: {
        ...state.userInfo,
        ...action.userInfo
      }
    };

  case actionTypes.LOGOUT:
    return {
      ...state,
      isLogin: false,
      userInfo: {}
    };
  default:
    return state;
  }
}
