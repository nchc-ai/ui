```javascript


conJob = {
  "course_id": "b86b2893-b876-45c2-a3f6-5e099c15d638",
  "dataset": [
    "cifar-10",
    "mnist"
  ],
  "gpu": 1,
  "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
  "image": "nvidia/caffe:latest",
  "introduction": "markdown text with escape",
  "level": "basic",
  "name": "mage process",
  "service": [
    {
      "label": "jupyter",
      "value": "http://140.110.5.22:30010"
    }
  ],
  "startAt": "2018-06-25T09:24:38Z",
  "status": "Ready"
}


vmJob = {
  "course_id": "b86b2893-b876-45c2-a3f6-5e099c15d638",
  "extraports": "888#444",
  "flavor": "2C4G-40GB",
  "floatingip": "140.110.5.105",
  "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
  "image": "Ubuntu 18.04",
  "introduction": "for big data",
  "level": "basic",
  "name": "hadoop course",
  "privateip": "10.0.2.10",
  "service": [
    {
      "label": "VNC",
      "value": "https://140.110.5.20:6080/vnc_auto.html?token=f093722f-1f8c-4649-a55c-004fe2525cae"
    }
  ],
  "sshkey": "mykey",
  "startAt": "2018-06-25T09:24:38Z",
  "status": "Ready",
  "vmname": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
  "volume": "1a0a872f-0b50-4707-9ded-2e9ff5788605"
}

formatJob = {
  courseId: _.get(datum, 'course_id'),
  id: _.get(datum, 'id'),
  name: _.get(datum, 'name'),
  introduction: _.get(datum, 'introduction'),
  level: _.get(datum, 'level'),
  image: _.get(datum, 'image'),
  service: _.get(datum, 'service'),
  startAt: _.get(datum, 'startAt'),
  status: _.get(datum, 'status'),

  dataset: _.get(datum, 'dataset'),
  gpu: _.get(datum, 'gpu'),

  extraports: _.get(datum, 'extraports'),
  flavor: _.get(datum, 'flavor'),
  floatingip: _.get(datum, 'floatingip'),
  privateip: _.get(datum, 'privateip'),
  sshkey: _.get(datum, 'sshkey'),
  vmname: _.get(datum, 'vmname'),
  volume: _.get(datum, 'volume')
}



```