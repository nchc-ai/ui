export const courseData = {
  headers: [
    {
      key: 1,
      text: '課程名稱'
    }, {
      key: 2,
      text: '講師名稱'
    }, {
      key: 3,
      text: '訓練資料'
    }, {
      key: 4,
      text: '建立日期'
    }
  ],
  cols: [
    {
      key: 1,
      text: 'courseName'
    }, {
      key: 2,
      text: 'teacher'
    }, {
      key: 3,
      text: 'data'
    }, {
      key: 4,
      text: 'date'
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
      value: 'name'
    }, {
      key: 2,
      value: 'level'
    }, {
      key: 3,
      value: 'date',
      type: 'date'
    }, {
      key: 4,
      value: '',
      type: 'more'
    }
  ]
};
