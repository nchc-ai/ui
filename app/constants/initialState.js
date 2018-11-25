export const initialGlobalSearchState = {
  searchText: ''
};

export const initialAddClassroomState = {
  intro: '',
  period: '',
  class: { label: '基礎', value: 'basic' },
  teacher: '',
  student: ''
};

export const initialAddCourseState = {
  name: '',
  introduction: '',
  image: '',
  level: { label: '基礎', value: 'basic' },
  startAt: '',
  endAt: '',
  server: '',
  gpu: '',
  datasets: []
};

export const initialUserState = {
  username: '',
  cName: '',
  company: '',
  'email-1': '',
  'email-2': '',
  phone: '',
  text: ''
};


export const initialProfileState = {
  username: '',
  cName: '',
  company: '',
  'email-1': '',
  'email-2': '',
  phone: '',
  text: ''
};

export const initialPasswordState = {
  password: '',
  confirmPassword: ''
};
