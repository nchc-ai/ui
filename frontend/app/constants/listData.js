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
