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
    placeholder: '請輸入英文名稱',
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
    className: 'fl',
    radioArr: [
      {
        key: 1,
        value: 'basic',
        label: '基礎'
      }, {
        key: 2,
        value: 'advance',
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
    target: 'addCourse',
    inputType: 'select',
    mainLabel: 'GPU核心數',
    options: [
      { label: 'x1', value: 1 },
      { label: 'x2', value: 2 },
      { label: 'x3', value: 3 },
      { label: 'x4', value: 4 }
    ],
    validators: { required },
    errorMessage: {
      required: '請輸入GPU核心數'
    },
    isRequired: true
  }, {
    key: 6,
    name: 'datasets',
    target: 'addCourse',
    inputType: 'tags-input',
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
