import React from 'react';
import _ from 'lodash';
import { pdfLink } from '../config/api';
import bulletTriangle from '../assets/images/common/bullet-triangle.png';


export const classroomDetailTpl = [
  {
    key: 1,
    bulletUrl: bulletTriangle,
    name: 'public',
    label: '課程狀態',
    type: 'boolean',
    custom: {
      trueText: '公開',
      falseText: '非公開'
    }
  }, {
    key: 2,
    bulletUrl: bulletTriangle,
    name: 'schedule.description',
    label: '課程週期',
    type: 'text'
  }, {
    key: 3,
    bulletUrl: bulletTriangle,
    name: 'studentCount',
    label: '學生人數',
    type: 'number',
    unit: '位'
  }, {
    key: 4,
    bulletUrl: bulletTriangle,
    name: 'teachers',
    label: '教課講師',
    type: 'multi-select'
  }
];


export const classroomGroupTpl = [
  {
    key: 1,
    name: 'teachers',
    label: '教課講師',
    type: 'multi-select'
  }, {
    key: 2,
    name: 'studentCount',
    label: '學生人數',
    type: 'number',
    unit: '位'
  }
];


export const courseCONTAINERDetailTpl = [
  {
    key: 1,
    bulletUrl: bulletTriangle,
    name: 'level',
    label: '課程程度',
    type: 'boolean',
    custom: {
      trueText: '進階',
      falseText: '基礎'
    }
  }, {
    key: 2,
    bulletUrl: bulletTriangle,
    name: 'image',
    label: '映像檔',
    type: 'single-select'
  }, {
    key: 3,
    bulletUrl: bulletTriangle,
    name: 'gpu',
    label: 'GPU核心數',
    type: 'single-select',
    unit: '核心'
  }, {
    key: 4,
    bulletUrl: bulletTriangle,
    name: 'datasets',
    label: '資料集',
    type: 'multi-select',
  }, {
    key: 5,
    bulletUrl: bulletTriangle,
    name: 'accessType',
    label: '存取方式',
    type: 'text'
  }, {
    key: 6,
    bulletUrl: bulletTriangle,
    name: 'ports',
    label: '存取端口',
    type: 'ports',
  }, {
    key: 7,
    bulletUrl: bulletTriangle,
    name: 'writablePath',
    label: '工作目錄',
    type: 'text',
  }
];

export const courseVMDetailTpl = [
  {
    key: 1,
    bulletUrl: bulletTriangle,
    name: 'level',
    label: '課程程度',
    type: 'boolean',
    custom: {
      trueText: '進階',
      falseText: '基礎'
    }
  }, {
    key: 2,
    bulletUrl: bulletTriangle,
    name: 'image',
    label: '映像檔',
    type: 'single-select'
  }, {
    key: 3,
    bulletUrl: bulletTriangle,
    name: 'flavor',
    label: '資源規模',
    type: 'single-select'
  }, {
    key: 4,
    bulletUrl: bulletTriangle,
    name: 'sshkey',
    label: 'SSH Key',
    type: 'single-select'
  },{
    key: 5,
    bulletUrl: bulletTriangle,
    name: 'associate',
    label: '建立浮動 IP',
    type: 'boolean',
    custom: {
      trueText: '是 (true)',
      falseText: '否 (false)'
    }
  }, {
    key: 6,
    bulletUrl: bulletTriangle,
    name: 'extraports',
    label: '額外網路埠',
    type: 'ports',
  }, {
    key: 7,
    bulletUrl: bulletTriangle,
    name: 'mount',
    label: '是否掛載',
    type: 'boolean'
  }, {
    key: 8,
    bulletUrl: bulletTriangle,
    name: 'volume',
    label: 'Volume Size',
    unit: 'GB',
    type: 'single-select'
  }
];


export const courseListBasic = [
  {
    key: 1,
    title: 'Series 1 基礎理論',
    infos: [
      {
        key: 1,
        value: '1. 機器學習與深度學習基礎概念及實作',
        isRequired: true
      }, {
        key: 2,
        value: '2. 深度學習模型佈署與優化',
        isRequired: true
      }, {
        key: 3,
        value: '3. 如何以機器學習模式: 對數據集進行趨勢預測',
        isRequired: false
      }
    ]
  }, {
    key: 2,
    title: 'Series 2 DIGITS 框架',
    infos: [
      {
        key: 1,
        value: '1. 基於DIGITS框架進行影像分類 (Image Classification)',
        isRequired: true
      }, {
        key: 2,
        value: '2. 基於DIGITS框架進行物件偵測 (Object Detection)',
        isRequired: false
      }, {
        key: 3,
        value: '3. 基於DIGITS框架進行影像切割 (Image Segmentation) : 以醫療影像為例',
        isRequired: false
      }, {
        key: 4,
        value: '4. 基於DIGITS框架進行體感深度影像切割 (Depth Image Segmentation)',
        isRequired: false
      }
    ]
  }, {
    key: 3,
    title: 'Series 3 基於TensorFlow and Keras的深度學習',
    infos: [
      {
        key: 1,
        value: '1. 基於TensorFlow 及Keras的深度學習介紹-- 基礎',
        isRequired: true
      }, {
        key: 2,
        value: '2. 基於TensorFlow 及Keras的深度學習介紹-- 進階',
        isRequired: true
      }
    ]
  }, {
    key: 4,
    title: 'Series 4 TensorFlow 框架',
    infos: [
      {
        key: 1,
        value: '1. TensorFlow基礎介紹',
        isRequired: true
      }, {
        key: 2,
        value: '2. 基於TensorFlow框架進行影像分類(Image Classification) ',
        isRequired: true
      }, {
        key: 3,
        value: '3. 基於TensorFlow框架進行物件偵測(Object Detection)',
        isRequired: false
      }, {
        key: 4,
        value: '4. 基於TensorFlow框架進行影像切割(Image Segmentation)',
        isRequired: false
      }, {
        key: 5,
        value: '5. 以 TensorFlow-lite 為移動裝置上的AI應用開發',
        isRequired: false
      }
    ]
  }

];


export const courseListAdvance = [
  {
    key: 1,
    title: 'Series 5 資料分析1.1',
    infos: [
      {
        key: 1,
        value: '1. R語言進階資料處理',
        isRequired: false
      }, {
        key: 2,
        value: '2. R資料處理實例: 透過室內定位系統預測位置',
        isRequired: false
      }, {
        key: 3,
        value: '3. R資料處理實例: 垃圾郵件辨識',
        isRequired: false
      }
    ]
  }, {
    key: 2,
    title: 'Series 6 神經網路',
    infos: [
      {
        key: 1,
        value: '1. 卷積神經網路(CNN):在雜訊中搜尋微小訊號',
        isRequired: false
      }, {
        key: 2,
        value: '2. 基於Tensorflow進行遞歸神經網路(RNN)分析',
        isRequired: false
      }
    ]
  }, {
    key: 3,
    title: 'Series 7 端點學習神經網路 (end to end netural network)',
    infos: [
      {
        key: 1,
        value: '1. 社群網路文字探勘應用與實作',
        isRequired: false
      }, {
        key: 2,
        value: '2. 生成對抗網路(GAN): 文字語音分析產生對應',
        isRequired: false
      }
    ]
  }, {
    key: 4,
    title: 'Series 8 佈署',
    infos: [
      {
        key: 1,
        value: '1. 透過CVSDK於X86系統佈署深度學習模型',
        isRequired: false
      }, {
        key: 2,
        value: '2. 最佳化訓練階段佈署: Tensorflow, caffe2分散式計算架構',
        isRequired: false
      }
    ]
  }

];

export const courseDetailBasic = {
  info: '以AI Framework的使用作為主體,規劃教材及課程內容, 讓學員能快速應用到實際場域中。',
  outerLink: pdfLink
};

export const courseDetailAdvance = {
  info: '以產業實際應用的需要做課程設計。內容涵蓋從資料分析、神經網路到佈署階段的應用。',
  outerLink: pdfLink
};
