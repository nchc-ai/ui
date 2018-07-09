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

export const jobs = row => ({
  id: _.get(row, 'id'),
  name: _.get(row, 'name'),
  status: _.get(row, 'status'),
  intro: _.get(row, 'introduction'),
  image: _.get(row, 'image'),
  gpu: _.get(row, 'gpu'),
  level: _.get(row, 'level'),
  service: _.get(row, 'service'),
  dataset: _.get(row, 'dataset'),
  createAt: _.get(row, 'createAt')
});
