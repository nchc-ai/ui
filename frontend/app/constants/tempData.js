export const jobs = [
  {
    "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
    "startAt": "2018-06-25T09:24:38Z",
    "status": "Ready",
    "name": "image process",
    "introduction": "markdown text with escape",
    "image": "nvidia/caffe:latest",
    "gpu": 1,
    "level": "basic",
    "dataset": [
      "cifar-10",
      "mnist"
    ],
    "service": [
      {
          "label": "jupyter",
          "value": "http://140.110.5.22:30010"
      },
      {
          "label": "digits",
          "value": "http://140.110.5.22:29875"
      }
    ]
  },
  {
    "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
    "startAt": "2018-06-25T09:24:38Z",
    "status": "Created",
    "name": "image process",
    "introduction": "markdown text with escape",
    "image":"nvidia/caffe:latest",
    "gpu": 1,
    "level": "advance",
    "dataset": [
      "cifar-10",
      "mnist"
    ],
    "service": [
      {
          "label": "digits",
          "value": "http://140.110.5.22:29119"
      }
    ]
  },
  {
    "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
    "startAt": "2018-06-25T09:24:38Z",
    "status": "Created",
    "name": "signal process",
    "introduction": "markdown text with escape",
    "image":"nvidia/caffe:latest",
    "gpu": 1,
    "level": "advance",
    "dataset": [
      "cifar-10",
      "mnist"
    ],
    "service": [
      {
          "label": "digits",
          "value": "http://140.110.5.22:29119"
      }
    ]
  }
];

