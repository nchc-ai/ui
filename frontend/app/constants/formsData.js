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
      required: '請輸入課程程度'
    },
    isRequired: true
  }, {
    key: 4,
    name: 'startAt',
    inputType: 'text',
    mainLabel: '開課時間',
    validators: { required },
    errorMessage: {
      required: '請輸入開課時間'
    },
    isRequired: true
  }, {
    key: 5,
    name: 'image',
    inputType: 'text',
    mainLabel: '映像檔',
    validators: { required },
    errorMessage: {
      required: '請輸入映像檔名稱'
    },
    isRequired: true
  }, {
    key: 6,
    name: 'gpu',
    inputType: 'text',
    mainLabel: 'GPU',
    validators: { required },
    errorMessage: {
      required: '請輸入GPU核心數'
    },
    isRequired: true
  }
];