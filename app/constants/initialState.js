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
  schedules: [],
  courses: [],
  schedules: [],
  teachers: [],
  students: [],
  public:  { label: '是(true)', value: true }
};

export const initialClassroomCronState = {
  startDate: new Date(),
  endDate: new Date(2020, 12, 31),
  periodBasic: { label: '每日', value: '*' },
  periodAdvance: []
};

export const initialCourseConState = {
  user: '',
  name: '',
  introduction: '',
  image: '',
  level: { label: '基礎', value: 'basic' },
  gpu: '',
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
  associate: { label: '否(false)', value: false },
  extraPorts: '',
  sshKey: '',
  mount: { label: '否(false)', value: false },
  volume: { label: '0 GB', value: 0 },
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
