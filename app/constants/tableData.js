/**
 * RoomPage 教室管理
 */
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
      type: 'link-detail',
      value: 'name'
    }, {
      key: 2,
      type: 'date',
      value: 'createAt'
    }, {
      key: 3,
      type: 'boolean',
      value: 'public'
    }, {
      key: 4,
      type: 'array',
      value: 'teachers'
    }, {
      key: 5,
      type: 'actions',
      value: ''
    }
  ]
};


/**
 * RoomPage 教室細項
 */
export const courseInfoData = {
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
    }
  ],
  cols: [
    {
      key: 1,
      type: 'link-detail',
      value: 'name',
      isLinkDisabled: true
    }, {
      key: 2,
      value: 'level',
      type: 'boolean',
      custom: {
        positive: 'advance',
        trueText: '進階',
        falseText: '基礎'
      }
    }, {
      key: 3,
      type: 'date',
      value: 'createAt'
    }
  ]
};


/**
 * RoomPage 開課列表
 */
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
      type: 'link-detail',
      value: 'name'
    }, {
      key: 2,
      value: 'level',
      type: 'boolean',
      custom: {
        positive: 'advance',
        trueText: '進階',
        falseText: '基礎'
      }
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
      type: 'link-detail',
      value: 'name'
    }, {
      key: 2,
      value: 'level',
      type: 'boolean',
      custom: {
        positive: 'advance',
        trueText: '進階',
        falseText: '基礎'
      }
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
      type: 'link-detail',
      value: 'name'
    }, {
      key: 2,
      value: 'level',
      type: 'boolean',
      custom: {
        positive: 'advance',
        trueText: '進階',
        falseText: '基礎'
      }
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
      type: 'link-detail',
      value: 'name'
    }, {
      key: 2,
      value: 'level',
      type: 'boolean',
      custom: {
        positive: 'advance',
        trueText: '進階',
        falseText: '基礎'
      }
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
