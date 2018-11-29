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

export const initialCourseConState = {
  name: '',
  introduction: '',
  image: '',
  level: { label: '基礎', value: 'basic' },
  server: '',
  gpu: '',
  datasets: [],
  startAt: '',
  endAt: ''
};


export const initialCourseVMState = {
  name: '',
  introduction: '',
  image: '',
  level: { label: '基礎', value: 'basic' },
  scale: { label: 'small', value: 'small' },
  floatIP: { label: '是', value: true },
  extraPorts: '',
  sshKey: '',
  mountVolume: { label: '0', value: 0 },
  startAt: '',
  endAt: '',
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
