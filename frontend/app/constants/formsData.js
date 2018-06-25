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
    mainLabel: '課程介紹',
    validators: { required },
    errorMessage: {
      required: '請輸入課程介紹'
    },
    isRequired: true
  }
];
