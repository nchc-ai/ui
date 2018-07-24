export const required = val => (val && val.length) || val.length > 0;

export const mailIsValid = (val) => /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val) || val.length === 0;

export const atLeastSix = val => (val && val.length) && val.length > 5;
