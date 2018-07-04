import _ from 'lodash';

export const courses = row => ({
  id: _.get(row, 'id'),
  name: _.get(row, 'name'),
  intro: _.get(row, 'introduction'),
  image: _.get(row, 'image'),
  gpu: _.get(row, 'gpu'),
  level: _.get(row, 'level'),
  datasets: _.get(row, 'datasets'),
  createAt: _.get(row, 'createAt')
});
