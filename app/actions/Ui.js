import * as types from './actionTypes';

export const toggleDialog = () => ({
  type: types.TOGGLE_DIALOG
});

export const openCustomDialog = (config) => ({
  type: types.OPEN_CUSTOM_DIALOG,
  config
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

export const toggleProgressBar = ({ toggle, progress }) => ({
  type: types.TOGGLE_PROGRESS_BAR,
  toggle,
  progress
});

export const removeProgressBar = () => ({
  type: types.REMOVE_PROGRESS_BAR
});
