import React from 'react';
import {
  required, mailIsValid
} from '../libraries/validation';

export const addCourseForm = [
  {
    key: 1,
    name: 'name',
    inputType: 'text',
    mainLabel: '課程名稱',
    validators: { required },
    errorMessage: {
      required: '請輸入課程名稱'
    },
    isRequired: true
  }, {
    key: 2,
    name: 'intro',
    inputType: 'text',
    mainLabel: '課程介紹',
    validators: { required },
    errorMessage: {
      required: '請輸入課程介紹'
    },
    isRequired: true
  }, {
    key: 3,
    name: 'level',
    inputType: 'text',
    mainLabel: '課程程度',
    validators: { required },
    errorMessage: {
      required: '請輸入課程介紹'
    },
    isRequired: true
  }, {
    key: 4,
    name: 'startAt',
    inputType: 'text',
    mainLabel: '開課時間',
    validators: { required },
    errorMessage: {
      required: '請輸入課程介紹'
    },
    isRequired: true
  }, {
    key: 5,
    name: 'image',
    inputType: 'text',
    mainLabel: '映像檔',
    validators: { required },
    errorMessage: {
      required: '請輸入課程介紹'
    },
    isRequired: true
  }
];


export const addCourseContainerOneForm = [
  {
    key: 1,
    name: 'server',
    inputType: 'text',
    mainLabel: '伺服器',
    validators: { required },
    errorMessage: {
      required: '請選取伺服器'
    },
    isRequired: true
  }, {
    key: 2,
    name: 'gpu',
    inputType: 'text',
    mainLabel: 'CPU',
    validators: { required },
    errorMessage: {
      required: '請輸入CPU核心數'
    },
    isRequired: true
  }
];

export const addCourseContainerTwoForm = [
  {
    key: 1,
    name: 'account',
    inputType: 'text',
    mainLabel: '帳號',
    placeholder: '請輸入連線帳號',
    validators: { required },
    errorMessage: {
      required: '請輸入連線帳號'
    },
    isRequired: true
  }, {
    key: 2,
    name: 'password',
    inputType: 'text',
    mainLabel: '密碼',
    placeholder: '請輸入連線密碼',
    validators: { required },
    errorMessage: {
      required: '請輸入連線密碼'
    },
    isRequired: true
  }
];
