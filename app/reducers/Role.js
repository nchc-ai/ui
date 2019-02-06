import * as actionTypes from '../actions/actionTypes';
import { LOADING, SUCCESS, FAIL } from '../constants/apiActions';

const InitialState = {
  isSubstituating: false,
  userInfo: {
    client_id: '',
    exp: '',
    role: '',
    scope: '',
    token_type: '',
    username: ''
  },
};

export default function Role(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.TOGGLE_SUBSTITUATING:
    return {
      ...state,
      isSubstituating: action.status
    };
  case actionTypes.START_SUBSTITUATING:
    return {
      ...state,
      isSubstituating: true,
      userInfo: {
        ...state.userInfo,
        username: action.value,
        role: action.role
      }
    }
  default:
    return state;
  }
}
