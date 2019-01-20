export const initialGlobalSearchState = {
  searchText: ''
};

export const initialClassroomState = {
  name: '',
  introduction: '',
  period: '',
  courses: '',
  teachers: '',
  students: ''
};

export const initialCourseConState = {
  user: '',
  name: '',
  introduction: '',
  image: '',
  level: { label: '基礎', value: 'basic' },
  gpu: '',
  ports: [],
  datasets: [],
  accessType: { label: 'NodePort', value: 'NodePort' },
  writablePath: '',
  startAt: '',
  endAt: ''
};


export const initialCourseVMState = {
  name: '',
  introduction: '',
  level: { label: '基礎', value: 'basic' },
  image: '',
  flavor: '',
  associate: { label: '否', value: false },
  extraPorts: '',
  sshKey: '',
  mount: { label: '否', value: false },
  volume: { label: '0', value: 0 },
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

export const initialRoleTeacherState = {
  role: { label: '', value: '' },
};

export const initialRoleStudentState = {
  role: { label: '', value: '' },
};

export const initialPasswordState = {
  password: '',
  confirmPassword: ''
};
