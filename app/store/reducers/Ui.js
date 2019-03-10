import * as actionTypes from 'actions/actionTypes';
import * as modalTypes from 'constants/types';

const InitialState = {
  SideNav: {
    isOpen: false,
    currentMenu: 'push',
    side: 'left',
    isWrapHidden: false
  },
  Dialog: {
    isOpen: false,
    title: '確認訊息',
    info: '詢問問題',
    target: '',
    cancelText: '取消',
    cancelMethod: '',
    submitText: '確認',
    submitMethod: ''
  },
  Dropdown: {
    pos: 0
  },
  Status: {
    offline: false,
    isAdmin: false
  },
  ProgressBar: {
    isActive: false,
    progress: 0
  }
};

export default function Ui(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.TOGGLE_DIALOG:
    return {
      ...state,
      Dialog: {
        ...state.Dialog,
        isOpen: !state.Dialog.isOpen
      }
    };
  case actionTypes.SET_DIALOG_INFO:
    return {
      ...state,
      Dialog: {
        ...state.Dialog,
        title: action.dialogInfo.title,
        info: action.dialogInfo.info,
        target: action.dialogInfo.target,
        cancelText: action.dialogInfo.cancelText,
        cancelMethod: action.dialogInfo.cancelMethod,
        submitText: action.dialogInfo.submitText,
        submitMethod: action.dialogInfo.submitMethod
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
  case actionTypes.TOGGLE_PROGRESS_BAR:
    return {
      ...state,
      ProgressBar: {
        isActive: action.toggle,
        progress: action.progress
      }
    };
  case actionTypes.REMOVE_PROGRESS_BAR:
    return {
      ...state,
      ProgressBar: {
        isActive: false,
        progress: 0
      }
    };
  default:
    return state;
  }
}
