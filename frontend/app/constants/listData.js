import React from 'react';
import IconCalendar from '../../public/images/course/ic-course-detail-date.png';
import IconImage from '../../public/images/course/ic-course-detail-image.png';
import IconGpu from '../../public/images/course/ic-course-detail-gpu.png';
import IconDatasets from '../../public/images/course/ic-course-detail-datasets.png';

export const courseDetailList = obj => ([
  {
    key: 1,
    icon: <img alt="" src={IconCalendar} />,
    label: '建立時間',
    type: 'date',
    value: obj.createAt
  }, {
    key: 2,
    icon: <img alt="" src={IconImage} />,
    label: '映像檔',
    value: obj.image
  }, {
    key: 3,
    icon: <img alt="" src={IconGpu} />,
    label: 'GPU核心數',
    value: obj.gpu
  }, {
    key: 4,
    icon: <img alt="" src={IconDatasets} />,
    label: '資料集',
    value: obj.image
  }
]);
