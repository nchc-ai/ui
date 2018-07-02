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
    inputType: 'markdown',
    mainLabel: '課程介紹',
    validators: { required },
    errorMessage: {
      required: '請輸入課程介紹'
    },
    isRequired: true
  }, {
    key: 3,
    name: 'level',
    inputType: 'radio',
    mainLabel: '課程程度',
    radioArr: [
      {
        key: 1,
        value: 1,
        label: '基礎'
      }, {
        key: 2,
        value: 2,
        label: '進階'
      }
    ],
    validators: { required },
    errorMessage: {
      required: '請輸入課程程度'
    },
    isRequired: true
  }, {
    key: 4,
    name: 'image',
    inputType: 'text',
    mainLabel: '映像檔',
    validators: { required },
    errorMessage: {
      required: '請輸入映像檔名稱'
    },
    isRequired: true
  }, {
    key: 5,
    name: 'gpu',
    inputType: 'text',
    mainLabel: 'GPU核心數',
    validators: { required },
    errorMessage: {
      required: '請輸入GPU核心數'
    },
    isRequired: true
  }, {
    key: 6,
    name: '',
    inputType: 'datasets',
    mainLabel: '資料集',
    options: [
      {
        key: 1,
        value: 1,
        label: 'asc'
      }, {
        key: 2,
        value: 2,
        label: '進階'
      }
    ],
    validators: { required },
    errorMessage: {
      required: '請輸入GPU核心數'
    },
    isRequired: true
  }
];
