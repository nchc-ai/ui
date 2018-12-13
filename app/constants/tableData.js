export const roomData = {
  headers: [
    {
      key: 1,
      text: '教室名稱'
    }, {
      key: 2,
      text: '建立日期'
    }, {
      key: 3,
      text: '是否公開'
    }, {
      key: 4,
      text: '開課老師'
    }, {
      key: 5,
      text: '操作'
    }
  ],
  cols: [
    {
      key: 1,
      type: 'link',
      value: 'name'
    }, {
      key: 2,
      type: 'date',
      value: 'createAt'
    }, {
      key: 3,
      type: 'bool',
      value: 'public'
    }, {
      key: 4,
      value: 'teachers'
    }, {
      key: 5,
      type: 'more',
      value: ''
    }
  ]
};


export const ongoingCourseData = {
  headers: [
    {
      key: 1,
      text: '課程名稱'
    }, {
      key: 2,
      text: '課程程度'
    }, {
      key: 3,
      text: '建立時間'
    }, {
      key: 4,
      text: '操作'
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
      type: 'actions',
      value: ''
    }
  ]
};


export const classroomGroupData = {
  headers: [
    {
      key: 1,
      text: '課程名稱'
    }, {
      key: 2,
      text: '課程程度'
    }, {
      key: 3,
      text: '建立時間'
    }, {
      key: 4,
      text: '操作'
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
      type: 'actions',
      value: ''
    }
  ]
};

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
      type: 'actions',
      text: '開始課程'
    }
  ]
};
