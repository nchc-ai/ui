export const courseData = {
  headers: [
    {
      key: 1,
      text: '課程名稱'
    }, {
      key: 2,
      text: '課程程度'
    }, {
      key: 3,
      text: '映像檔'
    }, {
      key: 4,
      text: 'GPU使用數'
    }, {
      key: 5,
      text: '建立時間'
    }
  ],
  cols: [
    {
      key: 1,
      type: 'link',
      value: 'name'
    }, {
      key: 2,
      type: 'level',
      value: 'level'
    }, {
      key: 3,
      value: 'image'
    }, {
      key: 4,
      value: 'gpu'
    }, {
      key: 5,
      type: 'date',
      value: 'createAt'
    }
  ]
};


export const userCourseData = {
  headers: [
    {
      key: 1,
      text: '課程名稱'
    }, {
      key: 2,
      text: '課程程度'
    }, {
      key: 3,
      text: '課程建立時間'
    }, {
      key: 4,
      text: ''
    }
  ],
  cols: [
    {
      key: 1,
      type: 'link',
      value: 'name'
    }, {
      key: 2,
      type: 'level',
      value: 'level'
    }, {
      key: 3,
      type: 'date',
      value: 'createAt'
    }, {
      key: 4,
      type: 'more',
      value: ''
    }
  ]
};
