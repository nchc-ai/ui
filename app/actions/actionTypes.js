// Auth

export const GET_META_INFO = ['GET_META_INFO_LOADING', 'GET_META_INFO_SUCCESS', 'GET_META_INFO_FAIL'];
export const GET_USER_INFO = ['GET_USER_INFO_LOADING', 'GET_USER_INFO_SUCCESS', 'GET_USER_INFO_FAIL'];
export const LOGIN = ['LOGIN_LOADING', 'LOGIN_SUCCESS', 'LOGIN_FAIL'];
export const HEALTH_CHECK = ['HEALTH_CHECK_LOADING', 'HEALTH_CHECK_SUCCESS', 'HEALTH_CHECK_FAIL'];
export const CHECK_DATABASE = ['CHECK_DATABASE_LOADING', 'CHECK_DATABASE_SUCCESS', 'CHECK_DATABASE_FAIL'];

// Auth -------------------
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_LOGIN_STATE = 'SET_LOGIN_STATE';
export const RETRIEVE_AUTH_FROM_SESSION = 'RETRIEVE_AUTH_FROM_SESSION';
export const REFRESH_TOKEN = ['REFRESH_TOKEN_LOADING', 'REFRESH_TOKEN_SUCCESS', 'REFRESH_TOKEN_FAIL'];

// Classroom -------------------
export const CREATE_CLASSROOM = ['CREATE_CLASSROOM_LOADING', 'CREATE_CLASSROOM_SUCCESS', 'CREATE_CLASSROOM_FAIL'];
export const GET_CLASSROOM_LIST = ['GET_CLASSROOM_LIST_LOADING', 'GET_CLASSROOM_LIST_SUCCESS', 'GET_CLASSROOM_LIST_FAIL'];
export const GET_CLASSROOM_DETAIL = ['GET_CLASSROOM_DETAIL_LOADING', 'GET_CLASSROOM_DETAIL_SUCCESS', 'GET_CLASSROOM_DETAIL_FAIL'];
export const DELETE_CLASSROOM = ['DELETE_CLASSROOM_LOADING', 'DELETE_CLASSROOM_SUCCESS', 'DELETE_CLASSROOM_FAIL'];
export const SET_STUDENTS_FIELD = 'SET_STUDENTS_FIELD';

export const GET_PUBLIC_CLASSROOMS = ['GET_PUBLIC_CLASSROOMS_LOADING', 'GET_PUBLIC_CLASSROOMS_SUCCESS', 'GET_PUBLIC_CLASSROOMS_FAIL'];

export const LOAD_COURSE_TAGS_ROOM_CREATE = ['LOAD_COURSE_TAGS_ROOM_CREATE_LOADING', 'LOAD_COURSE_TAGS_ROOM_CREATE_SUCCESS', 'LOAD_COURSE_TAGS_ROOM_CREATE_FAIL'];
export const LOAD_TEACHER_TAGS_ROOM_CREATE = ['LOAD_TEACHER_TAGS_ROOM_CREATE_LOADING', 'LOAD_TEACHER_TAGS_ROOM_CREATE_SUCCESS', 'LOAD_TEACHER_TAGS_ROOM_CREATE_FAIL'];
export const LOAD_STUDENT_TAGS_ROOM_CREATE = ['LOAD_TEACHER_TAGS_ROOM_CREATE_LOADING', 'LOAD_TEACHER_TAGS_ROOM_CREATE_SUCCESS', 'LOAD_TEACHER_TAGS_ROOM_CREATE_FAIL'];

export const UPLOAD_STUDENTS_CSV =  ['UPLOAD_STUDENTS_CSV_LOADING', 'UPLOAD_STUDENTS_CSV_SUCCESS', 'UPLOAD_STUDENTS_CSV_FAIL'];

export const RESET_STUDENTS_FIELD = 'RESET_STUDENTS_FIELD';

// Course [list > opts > submit]----------------------

//    - container
export const GET_COURSE_LIST_CON = ['GET_COURSE_LIST_CON_LOADING', 'GET_COURSE_LIST_CON_SUCCESS', 'GET_COURSE_LIST_CON_FAIL'];
export const GET_IMAGES_OPTS_CON = ['GET_IMAGES_OPTS_CON_LOADING', 'GET_IMAGES_OPTS_CON_SUCCESS', 'GET_IMAGES_OPTS_CON_FAIL'];
export const CREATE_CONTAINER_COURSE = ['CREATE_CONTAINER_COURSE_LOADING', 'CREATE_CONTAINER_COURSE_SUCCESS', 'CREATE_CONTAINER_COURSE_FAIL'];

//    - VM
export const GET_COURSE_LIST_VM = ['GET_COURSE_LIST_VM_LOADING', 'GET_COURSE_LIST_VM_SUCCESS', 'GET_COURSE_LIST_VM_FAIL'];
export const GET_IMAGES_OPTS_VM = ['GET_IMAGES_OPTS_VM_LOADING', 'GET_IMAGES_OPTS_VM_SUCCESS', 'GET_IMAGES_OPTS_VM_FAIL'];
export const GET_FLAVORS_OPTS_VM = ['GET_FLAVORS_OPTS_VM_LOADING', 'GET_FLAVORS_OPTS_VM_SUCCESS', 'GET_FLAVORS_OPTS_VM_FAIL'];
export const GET_SSH_KEYS_OPTS_VM = ['GET_SSH_KEYS_OPTS_VM_LOADING', 'GET_SSH_KEYS_OPTS_VM_SUCCESS', 'GET_SSH_KEYS_OPTS_VM_FAIL'];
export const SUBMIT_COURSE_VM = ['SUBMIT_COURSE_VM_LOADING', 'SUBMIT_COURSE_VM_SUCCESS', 'SUBMIT_COURSE_VM_FAIL'];

//    - JOB

export const GET_CON_JOB_LIST = ['GET_CON_JOB_LIST_LOADING', 'GET_CON_JOB_LIST_SUCCESS', 'GET_CON_JOB_LIST_FAIL'];
export const GET_VM_JOB_LIST = ['GET_VM_JOB_LIST_LOADING', 'GET_VM_JOB_LIST_SUCCESS', 'GET_VM_JOB_LIST_FAIL'];

export const LAUNCH_COURSE_JOB = ['LAUNCH_COURSE_JOB_LOADING', 'LAUNCH_COURSE_JOB_SUCCESS', 'LAUNCH_COURSE_JOB_FAIL'];
export const DELETE_JOB = ['DELETE_JOB_LOADING', 'DELETE_JOB_SUCCESS', 'DELETE_JOB_FAIL'];

export const SNAPSHOT_CONTAINER_JOB = ['SNAPSHOT_CONTAINER_JOB_LOADING', 'SNAPSHOT_CONTAINER_JOB_SUCCESS', 'SNAPSHOT_CONTAINER_JOB_FAIL'];
export const SNAPSHOT_VM_JOB = ['SNAPSHOT_VM_JOB_LOADING', 'SNAPSHOT_VM_JOB_SUCCESS', 'SNAPSHOT_VM_JOB_FAIL'];


// Role -------------------------

export const GET_USER_LIST_BY_ROLE = ['GET_USER_LIST_BY_ROLE_LOADING', 'GET_USER_LIST_BY_ROLE_SUCCESS', 'GET_USER_LIST_BY_ROLE_FAIL'];


// XXXXXXX ----------------------


export const GET_RESULT_LIST = ['GET_RESULT_LIST_LOADING', 'GET_RESULT_LIST_SUCCESS', 'GET_RESULT_LIST_FAIL'];


export const GET_COURSE_LIST_ALL = ['GET_COURSE_LIST_ALL_LOADING', 'GET_COURSE_LIST_ALL_SUCCESS', 'GET_COURSE_LIST_ALL_FAIL'];
export const GET_COURSE_LIST_BY_LEVEL = ['GET_COURSE_LIST_BY_LEVEL_LOADING', 'GET_COURSE_LIST_BY_LEVEL_SUCCESS', 'GET_COURSE_LIST_BY_LEVEL_FAIL'];
export const GET_COURSE_DETAIL = ['GET_COURSE_DETAIL_LOADING', 'GET_COURSE_DETAIL_SUCCESS', 'GET_COURSE_DETAIL_FAIL'];

export const SEARCH_COURSE = ['SEARCH_COURSE_LOADING', 'SEARCH_COURSE_SUCCESS', 'SEARCH_COURSE_FAIL'];

// User
export const GET_USER_COURSE_LIST = ['GET_USER_COURSE_LIST_LOADING', 'GET_USER_COURSE_LIST_SUCCESS', 'GET_USER_COURSE_LIST_FAIL'];

export const UPDATE_USER_COURSE = ['UPDATE_USER_COURSE_LOADING', 'UPDATE_USER_COURSE_SUCCESS', 'UPDATE_USER_COURSE_FAIL'];
export const DELETE_COURSE_CONTAINER = ['DELETE_COURSE_CONTAINER_LOADING', 'DELETE_COURSE_CONTAINER_SUCCESS', 'DELETE_COURSE_CONTAINER_FAIL'];


// Proxy
export const RESET_AUTH = 'RESET_AUTH';

export const SIGNUP = ['SIGNUP_LOADING', 'SIGNUP_SUCCESS', 'SIGNUP_FAIL'];
export const LOGOUT = ['LOGOUT_LOADING', 'LOGOUT_SUCCESS', 'LOGOUT_FAIL'];

export const UPDATE_PROFILE = ['UPDATE_PROFILE_LOADING', 'UPDATE_PROFILE_SUCCESS', 'UPDATE_PROFILE_FAIL'];
export const GET_PROFILE = ['GET_PROFILE_LOADING', 'GET_PROFILE_SUCCESS', 'GET_PROFILE_FAIL'];
export const UPDATE_PASSWORD = ['UPDATE_PASSWORD_LOADING', 'UPDATE_PASSWORD_SUCCESS', 'UPDATE_PASSWORD_FAIL'];


export const GET_CON_DATASETS_OPTS = ['GET_CON_DATASETS_OPTS_LOADING', 'GET_CON_DATASETS_OPTS_SUCCESS', 'GET_CON_DATASETS_OPTS_FAIL'];
export const GET_IMAGES_OPTS = ['GET_IMAGES_OPTS_LOADING', 'GET_IMAGES_OPTS_SUCCESS', 'GET_IMAGES_OPTS_FAIL'];

// Sync
export const SET_USER_TOKEN = 'SET_USER_TOKEN';


export const GET_TOKEN = ['GET_TOKEN_LOADING', 'GET_TOKEN_SUCCESS', 'GET_TOKEN_FAIL'];

// Role
export const START_SUBSTITUATING = 'START_SUBSTITUATING';
export const TOGGLE_SUBSTITUATING = 'TOGGLE_SUBSTITUATING';
// Ui
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export const OPEN_DIALOG = 'OPEN_DIALOG';
export const TOGGLE_PROGRESS_BAR = 'TOGGLE_PROGRESS_BAR';
export const REMOVE_PROGRESS_BAR = 'REMOVE_PROGRESS_BAR';