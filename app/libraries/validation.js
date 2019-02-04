import _ from 'lodash';

export const required = val => (val && _.get(val, 'length')) || _.get(val, 'length') > 0;

export const keyValRequired = array => _.some(array, (item) => !_.isEmpty(item.keyItem) && !_.isEmpty(item.valueItem));

export const mailIsValid = val => /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val) || _.get(val, 'length') === 0;

export const atLeastSix = val => (val && _.get(val, 'length')) && _.get(val, 'length') > 5;

// export const samePassword = vals => vals.password === vals.confirmPassword;
