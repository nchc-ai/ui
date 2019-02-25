import React from 'react';
import {
  required, mailIsValid, atLeastSix, samePassword, keyValRequired
} from '../libraries/validation';

// auth ----------------------------------------

export const signupForm = [
  {
    key: 1,
    size: 12,
    name: 'username',
    inputType: 'text',
    mainLabel: '帳號',
    placeholder: '請輸入您欲註冊的信箱',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入字元'
    },
    isRequired: true
  },  {
    key: 2,
    size: 12,
    name: 'cName',
    inputType: 'text',
    mainLabel: '中文姓名',
    placeholder: '請輸入中文姓名',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入中文姓名'
    },
    isRequired: true
  }, {
    key: 3,
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
    key: 4,
    size: 12,
    name: 'confirmPassword',
    inputType: 'password',
    mainLabel: '密碼確認',
    placeholder: '請再次輸入您的密碼',
    validators: { required },
    errorMessage: {
      required: '密碼至少需為 6 個字元'
    },
    isRequired: true
  }
];

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
    mainLabel: '教室描述'
  }, {
    key: 3,
    size: 8,
    name: 'schedule',
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
    inputType: 'async-tags-input',
    mainLabel: '教室課程',
    placeholder: '請輸入教室課程',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入課程'
    },
    isRequired: false
  }
];

export const classroomFormDatePeriod = [
  {
    key: 1,
    size: 8,
    name: 'startDate',
    target: 'schedule',
    inputType: 'date',
    mainLabel: '起始時間',
  }, {
    key: 2,
    size: 8,
    name: 'endDate',
    target: 'schedule',
    inputType: 'date',
    mainLabel: '結束時間',
  },

]
export const classroomFormDateBasic = [
  {
    key: 1,
    size: 8,
    name: 'periodBasic',
    target: 'schedule',
    inputType: 'radio',
    mainLabel: '選擇教室時間',
    className: 'fl',
    options: [
      {
        key: 1,
        radioKey: 'periodBasic-1',
        label: '每日',
        value: '*'
      }, {
        key: 2,
        radioKey: 'periodBasic-2',
        label: '平日',
        value: '1-5'
      }, {
        key: 3,
        radioKey: 'periodBasic-3',
        label: '假日',
        value: '6-7'
      }
    ],
    isRequired: false,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇週期'
    }
  }
];


export const classroomFormDateAdvance = [
  {
    key: 5,
    size: 8,
    name: 'periodAdvance',
    target: 'schedule',
    inputType: 'tags-input',
    mainLabel: '選擇教室時間',
    placeholder: '可多選',
    options: [{
      label: '星期一',
      value: '1'
    }, {
      label: '星期二',
      value: '2'
    }, {
      label: '星期三',
      value: '3'
    }, {
      label: '星期四',
      value: '4'
    }, {
      label: '星期五',
      value: '5'
    }, {
      label: '星期六',
      value: '6'
    }, {
      label: '星期日',
      value: '7'
    }],
    validators: { required },
    errorMessage: {
      required: '您尚未選擇任何時間'
    },
    isRequired: false
  }
];

export const classroomFormDateUnlimit = [
  {
    key: 1,
    size: 8,
    name: 'periodUnlimit',
    target: 'schedule',
    inputType: 'radio',
    mainLabel: '選擇教室時間',
    className: 'fl',
    options: [
      {
        key: 1,
        radioKey: 'periodUnlimit-1',
        value: '不限時間',
        label: '不限時間'
      }
    ],
    isRequired: false,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇週期'
    }
  }
];

export const classroomFormTwo = [
  {
    key: 5,
    size: 8,
    name: 'teachers',
    target: 'classroom',
    inputType: 'async-tags-input',
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
    placeholder: '請輸入欲上課學生'
  }, {
    key: 7,
    size: 8,
    name: 'public',
    target: 'classroom',
    inputType: 'radio',
    mainLabel: '對外公開',
    className: 'fl',
    options: [
      {
        key: 1,
        radioKey: 'public-1',
        value: true,
        label: '是 (true)'
      }, {
        key: 2,
        radioKey: 'public-2',
        value: false,
        label: '否 (false)'
      }
    ],
    isRequired: false,
    validators: { required },
    errorMessage: {
      required: '您尚未加入任何學生'
    }
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
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未輸入課程名稱'
    }
  }, {
    key: 2,
    size: 8,
    name: 'introduction',
    target: 'courseCon',
    inputType: 'markdown',
    mainLabel: '課程介紹'
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
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未加入任何學生'
    }
  }, {
    key: 4,
    size: 4,
    name: 'image',
    target: 'courseCon',
    placeholder: '請選擇映像檔',
    inputType: 'async-select',
    mainLabel: '映像檔',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇映像檔'
    }
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
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇 GPU 核心數'
    }
  }, {
    key: 6,
    size: 4,
    name: 'datasets',
    target: 'courseCon',
    inputType: 'async-tags-input',
    placeholder: '請選擇資料集',
    mainLabel: '資料集'
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
        label: 'Ingress (不同工作透過同一個埠存取，但映象檔需修改)'
      }, {
        key: 2,
        radioKey: '2-2',
        value: 'NodePort',
        label: 'NodePort (不同工作透過不同埠存取)'
      }
    ],
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未加入任何學生'
    }
  }, {
    key: 2,
    size: 8,
    name: 'ports',
    target: 'courseCon',
    inputType: 'keyValue',
    mainLabel: '存取端口',
    config: {
      headerText: 'Name | Port',
      addText: '新增端口',
      keyText: '應用',
      valueText: '端口'
    },
    className: 'fl',
    isRequired: true,
    errorMessage: {
      required: '有尚未填寫的存取端口資料'
    }
  }, {
    key: 3,
    size: 8,
    name: 'writablePath',
    inputType: 'text',
    mainLabel: '工作目錄',
    placeholder: '/tmp/work (絕對路徑)',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未加入任何工作目錄'
    }
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
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未輸入課程名稱'
    }
  }, {
    key: 2,
    size: 8,
    name: 'introduction',
    target: 'courseVM',
    inputType: 'markdown',
    mainLabel: '課程介紹',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未輸入課程介紹'
    }
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
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇課程程度'
    }
  }, {
    key: 4,
    size: 4,
    name: 'image',
    target: 'courseVM',
    placeholder: '請選擇映像檔',
    inputType: 'async-select',
    mainLabel: '映像檔',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇映像檔'
    }
  }]

  export const courseVMFormTwo = [{
    key: 5,
    size: 4,
    name: 'flavor',
    target: 'courseVM',
    placeholder: '請選擇資源規模',
    inputType: 'async-select',
    mainLabel: '資源規模',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇資源規模'
    }
  }];

  export const courseVMFormThree = [{
    key: 6,
    size: 4,
    name: 'sshkey',
    target: 'courseVM',
    placeholder: '請選擇SSH Key',
    inputType: 'async-select',
    mainLabel: 'SSH Key',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未填入任何 SSH Key'
    }
  }];

  export const courseVMFormFour = [{
    key: 7,
    size: 8,
    mainLabel: '建立浮動 IP',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇是否啟用此功能'
    },
    toggle: {
      inputType: 'toggle-control-input',
      name: 'associate',
      target: 'courseVM',
      onText: 'ON',
      offText: 'OFF'
    },
    input: {
      inputType: 'text',
      name: 'extraPorts',
      label: '額外網路埠',
      placeholder: 'Ex: 8080#80#443',
    }
  }];

  export const courseVMFormFive = [{
    key: 8,
    size: 4,
    mainLabel: '卦載 Volume 空間',
    isRequired: true,
    validators: { required },
    errorMessage: {
      required: '您尚未選擇是否啟用此功能'
    },
    toggle: {
      inputType: 'toggle-control-input',
      name: 'mount',
      target: 'courseVM',
      onText: 'ON',
      offText: 'OFF'
    },
    input: {
      inputType: 'select',
      name: 'extraPorts',
      label: 'Volume Size',
      options: [
        { label: '0 GB', value: '0' },
        { label: '10 GB', value: '10' },
        { label: '20 GB', value: '20' },
        { label: '30 GB', value: '30' },
      ]
    }
  }
];

export const profileForm = [
  {
    key: 1,
    size: 4,
    name: 'username',
    inputType: 'text',
    mainLabel: '帳號',
    isDisable: true
  }, {
    key: 2,
    size: 4,
    name: 'cName',
    inputType: 'text',
    mainLabel: '中文姓名',
    placeholder: '請輸入中文姓名',
    validators: { required },
    errorMessage: {
      required: '您尚未輸入中文姓名'
    },
    isRequired: true
  }, {
    key: 3,
    size: 4,
    name: 'company',
    inputType: 'text',
    mainLabel: '公司名稱',
    placeholder: '請輸入公司名稱',
    isRequired: false
  }, {
    key: 4,
    size: 4,
    name: 'phone',
    inputType: 'text',
    mainLabel: '手機',
    placeholder: '請輸入手機號碼',
    validators: { },
    errorMessage: {
      required: '您尚未輸入手機號碼'
    },
    isRequired: false
  }, {
    key: 5,
    size: 4,
    name: 'email-1',
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
    size: 4,
    name: 'email-2',
    inputType: 'text',
    mainLabel: '備用信箱',
    placeholder: '請輸入備用信箱',
    validators: { mailIsValid },
    errorMessage: {
      mailIsValid: '此欄位應為信箱格式'
    },
    isRequired: false
  }, {
    key: 7,
    size: 8,
    name: 'text',
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
    mainLabel: '新密碼確認',
    placeholder: '請再次輸入您的密碼',
    validators: { required },
    errorMessage: {
      required: '密碼至少需為 6 個字元'
    },
    isRequired: true
  }
];


export const snapshotForm = [
  {
    key: 1,
    size: 12,
    name: 'name',
    inputType: 'text',
    mainLabel: '快照名稱',
    placeholder: '填入格式：alphanumerics, space, and [.-_]',
    validators: { required },
    errorMessage: {
      required: '填入格式：alphanumerics, space, and [.-_]'
    },
    isRequired: true
  }
];
