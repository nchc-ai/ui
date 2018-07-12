import * as types from './actionTypes';

export const closeModal = () => ({
  type: types.CLOSE_MODAL
});

export const openDeleteDialog = (target, targetId) => ({
  type: types.OPEN_DELETE_MODAL,
  target,
  targetId
});

export const openAddItemModal = () => ({
  type: types.OPEN_ADD_ITEM_MODAL
});

export const openResetDialog = target => ({
  type: types.OPEN_RESET_MODAL,
  target
});

export const openUploadModal = () => ({
  type: types.OPEN_UPLOAD_MODAL
});

export const openCheckoutModal = query => ({
  type: types.OPEN_CHECKOUT_MODAL,
  query
});


export const setDropdownPos = pos => ({
  type: types.SET_DROPDOWN_POS,
  pos
});

export const toggleSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV
});

export const toggleHidden = () => ({
  type: types.TOGGLE_HIDDEN
});
