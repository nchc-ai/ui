export const initialGlobalSearchState = {
  searchText: ''
};

export const iinitialSnapshotState = {
  name: ''
};

export const initialClassroomState = {
  id: '',
  name: '',
  description: '',
  calendar: [],
  schedule: {
    cronFormat: [],
    description: '',
    startDate: new Date(),
    endDate: new Date().setMonth(new Date().getMonth() + 2),
    selectedType: 0,
    selectedOption: [{
      label: '每日',
      value: '*'
    }]
  },
  courses: [],
  teachers: [],
  students: [],
  public:  { label: '是(true)', value: true }
};

export const initialCourseConState = {
  user: '',
  name: '',
  introduction: '',
  image: '',
  level: { label: '基礎', value: 'basic' },
  gpu: { label: 'x0', value: 0 },
  ports: [
    {
      keyItem: '',
      valueItem: ''
    }
  ],
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
  associate: false,
  extraports: [
    {
      keyItem: '',
      valueItem: ''
    }
  ],
  sshkey: '',
  mount: false,
  volume: { label: '10 GB', value: '10' },
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

export const initialSignupState = {
  username: '',
  password: '',
  confirmPassword: ''
};

export const initialPasswordState = {
  password: '',
  confirmPassword: ''
};
