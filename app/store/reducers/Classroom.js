import * as actionTypes from 'actions/actionTypes';
import { LOADING, SUCCESS } from 'constants/apiActions';

const InitialState = {
  create: {
    isLoading: false,
  },
  update: {
    isLoading: false,
  },
  list: {
    isLoading: false,
    data: []
  },
  detail: {
    isLoading: false,
    data: {}
  },
  publicList: {
    isLoading: false,
    data: []
  },
  students: {
    isLoading: false,
    data: []
  },
  calendar: {
    isLoading: false,
    data: [
      {
        start: '2019-01-01',
        end: '2019-01-01',
        eventClasses: 'custom-event-class',
        title: ' 交大教室 ',
        description: ''
      }
    ]
  }
};

export default function Classroom(state = InitialState, action) {
  switch (action.type) {
  case actionTypes.CREATE_CLASSROOM[LOADING]:
    return {
      ...state,
      create: {
        isLoading: true
      }
    };
  case actionTypes.CREATE_CLASSROOM[SUCCESS]:
    return {
      ...state,
      create: {
        isLoading: false
      }
    };
  case actionTypes.UPDATE_CLASSROOM[LOADING]:
    return {
      ...state,
      update: {
        isLoading: true
      }
    };
  case actionTypes.UPDATE_CLASSROOM[SUCCESS]:
    return {
      ...state,
      update: {
        isLoading: false
      }
    };
  case actionTypes.GET_CLASSROOM_LIST[LOADING]:
    return {
      ...state,
      list: {
        ...state.list,
        isLoading: true
      }
    };
  case actionTypes.GET_CLASSROOM_LIST[SUCCESS]:
    return {
      ...state,
      list: {
        isLoading: false,
        data: action.payload.classrooms
      }
    };
  case actionTypes.GET_CLASSROOM_DETAIL[LOADING]:
    return {
      ...state,
      detail: {
        ...state.detail,
        isLoading: true
      }
    };
  case actionTypes.GET_CLASSROOM_DETAIL[SUCCESS]:

    const teachers = _.get(action,'payload.classroom.teachers',[]).map(teacher => ({
      label: teacher.value,
      value: teacher.value,
    }));

    // const students = _.get(action,'payload.classroom.students',[]).map(student => ({
    //   label: student.value,
    //   value: student.value,
    // }));

    return {
      ...state,
      detail: {
        isLoading: false,
        data: {
          ...action.payload.classroom,
          teachers
        }
      }
    };
  case actionTypes.GET_PUBLIC_CLASSROOMS[LOADING]:
    return {
      ...state,
      publicList: {
        ...state.publicList,
        isLoading: true
      },
      calendar: {
        ...state.calendar,
        isLoading: true
      }
    };
  case actionTypes.GET_PUBLIC_CLASSROOMS[SUCCESS]:
    const modifiedRooms = action.payload.classrooms.map((room) => ({
      ... room,
      teachers: _.get(room,'teachers',[]).map((teacher) => ({
        ...teacher,
        label: teacher.value
      }))
    }))

    // 合併產生 calendar list

    const calendarData = [];

    action.payload.classrooms.forEach((classroom, index) => {
      classroom.calendar.forEach((calendarItem, index) => {
        const { startMonth, startDate, endDate } = calendarItem;
        const month = startMonth >= 10 ? `${startMonth}` : `0${startMonth}`;

        calendarData.push({
          description: classroom.description,
          eventClasses: "custom-event-class",
          end: endDate,
          start: startDate,
          title: classroom.name
        })
      })
    })

    // console.log('calendarData', calendarData);
    return {
      ...state,
      publicList: {
        isLoading: false,
        data: modifiedRooms
      },
      calendar: {
        isLoading: false,
        data: calendarData
      },
    };
  case actionTypes.UPLOAD_STUDENTS_CSV[LOADING]:
    return {
      ...state,
      students: {
        ...state.students,
        isLoading: true
      }
    };
  case actionTypes.UPLOAD_STUDENTS_CSV[SUCCESS]:

    const data = action.payload.users.map((d, i) => ({ keyItem: d.name, valueItem: d.email }))
    return {
      ...state,
      students: {
        isLoading: false,
        data
      }
    };
  case actionTypes.RESET_STUDENTS_FIELD:
    return {
      ...state,
      students: {
        isLoading: false,
        data: []
      }
    };
  case actionTypes.SET_STUDENTS_FIELD:
    return {
      ...state,
      students: {
        isLoading: false,
        data: action.students
      }
    };
  default:
    return state;
  }
}
