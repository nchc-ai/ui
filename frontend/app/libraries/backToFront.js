import _ from 'lodash';

export const coures = row => ({
  name: _.get(row, 'name'),
  teacher: '',
  level: _.get(row, 'level'),
  data: _.get(row, 'image'),
  date: _.get(row, '')
});
