import React from 'react';
import _ from 'lodash';
import IconCalendar from '../../public/images/course/ic-course-detail-date.png';
import IconImage from '../../public/images/course/ic-course-detail-image.png';
import IconGpu from '../../public/images/course/ic-course-detail-gpu.png';
import IconDatasets from '../../public/images/course/ic-course-detail-datasets.png';

export const courseDetailList = obj => ([
  {
    key: 1,
    icon: <img alt="" src={IconCalendar} />,
    labelVal: 'date',
    label: '建立時間',
    type: 'date',
    value: _.get(obj, 'createAt', '')
  }, {
    key: 2,
    icon: <img alt="" src={IconImage} />,
    labelVal: 'image',
    label: '映像檔',
    value: _.get(obj, 'image', '')
  }, {
    key: 3,
    icon: <img alt="" src={IconGpu} />,
    labelVal: 'gpu',
    label: 'GPU核心數',
    value: _.get(obj, 'gpu', '')
  }, {
    key: 4,
    icon: <img alt="" src={IconDatasets} />,
    labelVal: 'dataset',
    label: '資料集',
    type: 'array',
    value: _.get(obj, 'datasets', ''),
    comma: ','
  }
]);



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
  outerLink: '/course/basic'
};

export const courseDetailAdvance = {
  info: '以產業實際應用的需要做課程設計。內容涵蓋從資料分析、神經網路到佈署階段的應用。',
  outerLink: '/course/advance'
};
