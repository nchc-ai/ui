import React from 'react';
import {
  required, mailIsValid
} from '../libraries/validation';

export const addCourseForm = [
  {
    key: 1,
    size: 8,
    name: 'name',
    inputType: 'text',
    mainLabel: '課程名稱',
    placeholder: '請輸入課程名稱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 2,
    size: 8,
    name: 'intro',
    target: 'addCourse',
    inputType: 'markdown',
    mainLabel: '課程介紹',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 3,
    size: 8,
    name: 'level',
    target: 'addCourse',
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
      required: '您尚未輸入課程程度'
    },
    isRequired: true
  }, {
    key: 4,
    size: 4,
    name: 'image',
    target: 'addCourse',
    placeholder: '請選擇映像檔',
    inputType: 'async-select',
    mainLabel: '映像檔',
    validators: { required },
    errorMessage: {
      required: '您尚未選擇映像檔'
    },
    isRequired: true
  }, {
    key: 5,
    size: 4,
    name: 'gpu',
    target: 'addCourse',
    inputType: 'select',
    mainLabel: 'GPU核心數',
    options: [
      { label: 'x0', value: 0 },
      { label: 'x1', value: 1 },
      { label: 'x2', value: 2 },
      { label: 'x3', value: 3 },
      { label: 'x4', value: 4 },
      { label: 'x5', value: 5 },
      { label: 'x6', value: 6 },
      { label: 'x7', value: 7 },
      { label: 'x8', value: 8 }
    ],
    validators: { required },
    errorMessage: {
      required: '請輸入GPU核心數'
    },
    isRequired: true
  }, {
    key: 6,
    size: 8,
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
    isRequired: false
  }
];
