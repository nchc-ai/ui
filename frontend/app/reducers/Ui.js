import * as actionTypes from '../actions/actionTypes';
import * as modalTypes from '../constants/types';

const InitialState = {
  SideNav: {
    isOpen: false,
    currentMenu: 'push',
    side: 'left',
    isWrapHidden: false
  },
  Modal: {
    isOpen: false,
    headerText: '確認訊息',
    content: '',
    type: '',
    target: '',
    targetId: '',
    query: ''
  },
  Dropdown: {
    pos: 0
  },
  Status: {
    offline: false,
    isAdmin: false
  }
};

export default function Ui(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.CLOSE_MODAL:
    return {
      ...state,
      Modal: {
        ...state.Modal,
        isOpen: false
      }
    };
  case actionTypes.OPEN_DELETE_MODAL:
    return {
      ...state,
      Modal: {
        isOpen: true,
        headerText: '刪除提醒',
        content: `確定要刪除 '${action.targetId}' 嗎？`,
        type: modalTypes.CONFIRM_DELETE,
        target: action.target,
        targetId: action.targetId
      }
    };
  case actionTypes.OPEN_ADD_ITEM_MODAL:
    return {
      ...state,
      Modal: {
        isOpen: true,
        headerText: '確認訊息',
        content: '商品已新增',
        type: modalTypes.CONFIRM_ONLY
      }
    };
  case actionTypes.OPEN_RESET_MODAL:
    return {
      ...state,
      Modal: {
        ...state.Modal,
        isOpen: true,
        headerText: '確認訊息',
        content: '確認要重置嗎？',
        type: modalTypes.CONFIRM_RESET,
        target: action.target
      }
    };
  case actionTypes.OPEN_UPLOAD_MODAL:
    return {
      ...state,
      Modal: {
        ...state.Modal,
        isOpen: true,
        headerText: '確認訊息',
        content: '確認要上傳嗎？',
        type: modalTypes.CONFIRM_UPLOAD
      }
    };
  case actionTypes.OPEN_CHECKOUT_MODAL:
    return {
      ...state,
      Modal: {
        ...state.Modal,
        isOpen: true,
        headerText: '確認訊息',
        content: '請務必確認內容。',
        type: modalTypes.CONFIRM_CHECKOUT,
        query: action.query
      }
    };
  case actionTypes.SET_DROPDOWN_POS:
    return {
      ...state,
      Dropdown: {
        ...state.Dropdown,
        pos: action.pos
      }
    };
  case actionTypes.TOGGLE_SIDE_NAV:
    return {
      ...state,
      SideNav: {
        ...state.SideNav,
        isOpen: false
      }
    };
  case actionTypes.TOGGLE_HIDDEN:
    return {
      ...state,
      SideNav: {
        ...state.SideNav,
        isWrapHidden: !state.SideNav.isWrapHidden
      }
    };
  default:
    return state;
  }
}
