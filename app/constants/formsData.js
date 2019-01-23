import React from 'react';
import {
  required, mailIsValid, atLeastSix, samePassword
} from '../libraries/validation';

// course container ----------------------------------------

export const classroomFormOne = [
  {
    key: 1,
    size: 8,
    name: 'name',
    target: 'classroom',
    inputType: 'text',
    mainLabel: '教室名稱',
    placeholder: '請輸入教室名稱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 2,
    size: 8,
    name: 'description',
    target: 'classroom',
    inputType: 'markdown',
    mainLabel: '教室描述',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 3,
    size: 8,
    name: 'schedules',
    target: 'classroom',
    inputType: 'cron-input',
    mainLabel: '時間選擇',
    placeholder: '可建立多個 cron 格式',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 4,
    size: 8,
    name: 'courses',
    target: 'classroom',
    inputType: 'tags-input',
    mainLabel: '教室課程',
    placeholder: '請輸入教室課程',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入課程'
    },
    isRequired: false
  }
];

export const classroomFormTwo = [
  {
    key: 5,
    size: 8,
    name: 'teachers',
    target: 'classroom',
    inputType: 'tags-input',
    mainLabel: '選擇加入此教室的老師',
    placeholder: '請輸入老師名稱',
    validators: { required },
    errorMessage: {
      required: '您尚未加入任何老師'
    },
    isRequired: false
  }, {
    key: 6,
    size: 8,
    name: 'students',
    target: 'classroom',
    inputType: 'file',
    mainLabel: '選擇加入此教室的學生',
    placeholder: '請輸入欲上課學生',
    validators: { required },
    errorMessage: {
      required: '您尚未加入任何學生'
    },
    isRequired: false
  }
];


// course container ----------------------------------------

export const courseConForm = [
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
    name: 'introduction',
    target: 'courseCon',
    inputType: 'markdown',
    mainLabel: '課程介紹',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  }, {
    key: 3,
    radioKey: 1,
    size: 8,
    name: 'level',
    target: 'courseCon',
    inputType: 'radio',
    mainLabel: '課程程度',
    className: 'fl',
    options: [
      {
        key: 1,
        radioKey: '1-1',
        value: 'basic',
        label: '基礎'
      }, {
        key: 2,
        radioKey: '1-2',
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
    target: 'courseCon',
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
    target: 'courseCon',
    inputType: 'select',
    placeholder: '請選擇 GPU 核心數',
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
    size: 4,
    name: 'datasets',
    target: 'courseCon',
    inputType: 'tags-input',
    placeholder: '請選擇資料集',
    mainLabel: '資料集',
    isRequired: false
  }
];


export const courseConFormTwo = [
  {
    key: 1,
    radioKey: 2,
    size: 8,
    name: 'accessType',
    target: 'courseCon',
    inputType: 'radio',
    mainLabel: '存取方式',
    className: 'fl',
    options: [
      {
        key: 1,
        radioKey: '2-1',
        value: 'Ingress',
        label: 'Ingress'
      }, {
        key: 2,
        radioKey: '2-2',
        value: 'NodePort',
        label: 'NodePort'
      }
    ],
    validators: { required },
    errorMessage: {
      required: '您尚未輸入存取方式'
    }
  }, {
    key: 2,
    size: 8,
    name: 'ports',
    target: 'courseCon',
    inputType: 'keyValue',
    mainLabel: '存取端口',
    className: 'fl',
    options: [
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
    key: 3,
    size: 8,
    name: 'writablePath',
    inputType: 'text',
    mainLabel: '工作目錄',
    placeholder: '/tmp/work',
    isRequired: false
  }
];

// courseVM ----------------------------------------

export const courseVMFormOne = [
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
    name: 'introduction',
    target: 'courseVM',
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
    target: 'courseVM',
    inputType: 'radio',
    mainLabel: '課程程度',
    className: 'fl',
    options: [
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
    target: 'courseVM',
    placeholder: '請選擇映像檔',
    inputType: 'async-select',
    mainLabel: '映像檔',
    validators: { required },
    errorMessage: {
      required: '您尚未選擇映像檔'
    },
    isRequired: true
  }]

  export const courseVMFormTwo = [{
    key: 5,
    size: 4,
    name: 'flavor',
    target: 'courseVM',
    placeholder: '請選擇資源規模',
    inputType: 'async-select',
    mainLabel: '資源規模',
    validators: { required },
    errorMessage: {
      required: '請輸入資源規模'
    },
    isRequired: true
  }, {
    key: 6,
    size: 8,
    name: 'associate',
    target: 'courseVM',
    inputType: 'radio',
    mainLabel: 'Associate Flooting IP',
    className: 'fl',
    options: [
      {
        key: 1,
        value: true,
        label: '是'
      }, {
        key: 2,
        value: false,
        label: '否'
      }
    ],
    isRequired: false
  }];

  export const courseVMFormThree = [{
    key: 7,
    size: 8,
    name: 'extraPorts',
    target: 'courseVM',
    inputType: 'text',
    mainLabel: 'Extra Ports',
    placeholder: 'ex: 8080#80#443',
    isRequired: false
  }, {
    key: 8,
    size: 4,
    name: 'sshKey',
    target: 'courseVM',
    placeholder: '請選擇SSH Key',
    inputType: 'async-select',
    mainLabel: 'SSH Key',
    isRequired: false,
    errorMessage: {
      required: '您尚未選擇SSH KEY'
    },
  },  {
    key: 9,
    size: 8,
    name: 'mount',
    target: 'courseVM',
    inputType: 'radio',
    mainLabel: '是否 Mount',
    className: 'fl',
    options: [
      {
        key: 1,
        value: true,
        label: '是'
      }, {
        key: 2,
        value: false,
        label: '否'
      }
    ],
    validators: { required },
    errorMessage: {
      required: '請輸入所需容量'
    },
  }, {
    key: 10,
    size: 3,
    name: 'volume',
    target: 'courseVM',
    inputType: 'select',
    mainLabel: 'Volume',
    unit: 'GB',
    options: [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '30', value: '30' },
    ],
    validators: { required },
    errorMessage: {
      required: '請輸入所需容量'
    },
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
    key: 3,
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
    key: 4,
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
    key: 5,
    size: 8,
    name: 'email',
    inputType: 'text',
    mainLabel: '信箱',
    placeholder: '請輸入主要信箱',
    validators: { required, mailIsValid },
    errorMessage: {
      required: '您尚未輸入字元',
      mailIsValid: '此欄位應為信箱格式'
    },
    isRequired: true
  }, {
    key: 6,
    size: 8,
    name: 'backupEmail',
    inputType: 'text',
    mainLabel: '備用信箱',
    placeholder: '請輸入備用信箱',
    isRequired: false
  }, {
    key: 7,
    size: 8,
    name: 'applyReason',
    inputType: 'textarea',
    mainLabel: '申請原因',
    placeholder: '請輸入申請用途',
    isRequired: false
  }
];

export const roleTeacherForm = [
  {
    key: 1,
    size: 4,
    name: 'role',
    target: 'role',
    inputType: 'async-select',
    mainLabel: '選擇老師',
    validators: { required },
    placeholder: '請選擇要切換的老師帳號',
    errorMessage: {
      required: '請選擇欲切換的目標使用者'
    },
    isRequired: true
  }
];

export const roleStudentForm = [
  {
    key: 1,
    size: 4,
    name: 'role',
    target: 'role',
    inputType: 'async-select',
    mainLabel: '選擇學生',
    validators: { required },
    placeholder: '請選擇要切換的學生帳號',
    errorMessage: {
      required: '請選擇欲切換的目標使用者'
    },
    isRequired: true
  }
];

export const passwordForm = [
  {
    key: 1,
    size: 8,
    name: 'password',
    inputType: 'password',
    mainLabel: '新密碼',
    placeholder: '請輸入您的密碼',
    validators: { atLeastSix },
    errorMessage: {
      atLeastSix: '密碼至少需為 6 個字元'
    },
    isRequired: true
  }, {
    key: 2,
    size: 8,
    name: 'confirmPassword',
    inputType: 'password',
    mainLabel: '密碼確認',
    placeholder: '請再次輸入您的密碼',
    validators: { required },
    errorMessage: {
      required: '密碼至少需為 6 個字元'
    },
    isRequired: true
}];
