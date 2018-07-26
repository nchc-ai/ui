import React from 'react';
import {
  required, mailIsValid, atLeastSix
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



export const signupForm = [
  {
    key: 1,
    size: 12,
    name: 'username',
    inputType: 'text',
    mainLabel: '帳號',
    placeholder: '請輸入您的信箱',
    validators: { required, mailIsValid },
    errorMessage: {
      required: '您尚未輸入字元',
      mailIsValid: '帳號應為信箱格式'
    },
    isRequired: true
  }, {
    key: 2,
    size: 12,
    name: 'password',
    inputType: 'password',
    mainLabel: '密碼',
    placeholder: '請輸入您的密碼',
    validators: { atLeastSix },
    errorMessage: {
      atLeastSix: '密碼至少需為 6 個字元'
    },
    isRequired: true
  }, {
    key: 3,
    size: 12,
    name: 'cName',
    inputType: 'text',
    mainLabel: '中文姓名',
    placeholder: '請輸入中文姓名',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 4,
    size: 12,
    name: 'company',
    inputType: 'text',
    mainLabel: '公司名稱',
    placeholder: '請輸入公司名稱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 5,
    size: 12,
    name: 'phone',
    inputType: 'text',
    mainLabel: '手機',
    placeholder: '請輸入號碼',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 6,
    size: 12,
    name: 'email',
    inputType: 'text',
    mainLabel: '信箱',
    placeholder: '請輸入主要信箱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 7,
    size: 12,
    name: 'secondaryEmail',
    inputType: 'text',
    mainLabel: '備用信箱',
    placeholder: '請輸入備用信箱',
    isRequired: false
  }, {
    key: 8,
    size: 12,
    name: 'text',
    inputType: 'textarea',
    mainLabel: '申請原因',
    placeholder: '請輸入申請用途',
    isRequired: false
  }
];


export const profileForm = [
  {
    key: 1,
    size: 8,
    name: 'username',
    inputType: 'text',
    mainLabel: '帳號',
    placeholder: '請輸入您的信箱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true,
    isDisable: true
  }, {
    key: 2,
    size: 8,
    name: 'password',
    inputType: 'password',
    mainLabel: '密碼',
    placeholder: '請輸入您的密碼',
    validators: { atLeastSix },
    errorMessage: {
      atLeastSix: '密碼至少需為 6 個字元'
    },
    isRequired: true
  }, {
    key: 3,
    size: 8,
    name: 'cName',
    inputType: 'text',
    mainLabel: '中文姓名',
    placeholder: '請輸入中文姓名',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 4,
    size: 8,
    name: 'company',
    inputType: 'text',
    mainLabel: '公司名稱',
    placeholder: '請輸入公司名稱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 5,
    size: 8,
    name: 'phone',
    inputType: 'text',
    mainLabel: '手機',
    placeholder: '請輸入號碼',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 6,
    size: 8,
    name: 'email-1',
    inputType: 'text',
    mainLabel: '信箱',
    placeholder: '請輸入主要信箱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 7,
    size: 8,
    name: 'email-2',
    inputType: 'text',
    mainLabel: '備用信箱',
    placeholder: '請輸入備用信箱',
    isRequired: false
  }, {
    key: 8,
    size: 8,
    name: 'text',
    inputType: 'textarea',
    mainLabel: '申請原因',
    placeholder: '請輸入申請用途',
    isRequired: false
  }
];
