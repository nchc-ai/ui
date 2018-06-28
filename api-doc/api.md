<!--ts-->
   * [Course](#course)
      * [X] [List](#list)
      * [X] [Create](#create)
      * [X] [Launch](#launch)
      * [ ] [Delete](#delete)
      * [X] [List different level course](#list-different-level-course)
   * [Job](#job)
      * [X] [List](#list-1)
      * [ ] [Delete](#delete-1)
   * [DataSet](#dataset)
      * [X] [List](#list-2)
   * [Health Check](#health-check)
      * [X] [check kubernetes](#check-kubernetes)
      * [X] [check kubernetes with token](#check-kubernetes-with-token)
      * [X] [check database](#check-database)
      * [X] [check database with token](#check-database-with-token)
   * [Proxy](#proxy)
      * [X] [Token](#token)
      * [X] [Refresh](#refresh)
   * [Image](#image)
      * [ ] [List](#list-3)
      
<!-- Added by: ogre0403, at:  -->

<!--te-->

# Course

## List

* **Description**
 
  List user's all courses information

* **URL**

  /v1/course/list/

* **Header:**

  `Authorization=Bearer <token-string>`

* **Method:**

  `POST`

* **URL Params**

  None

* **Data Params**

  ```json
    {
      "user": "user-name"
    }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "courses":[
          {
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "createAt": "2018-06-25T09:24:38Z",
            "name":"image process",
            "introduction" : "markdown text with escape",
            "image":"nvidia/caffe:latest",
            "gpu": 1,
            "level": "basic",
            "datasets":[
              "cifar-10"
            ]
          },
          {
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "createAt": "2018-06-25T09:24:38Z",
            "name":"image process",
            "introduction" : "markdown text with escape",
            "image":"nvidia/caffe:latest",
            "gpu": 1,
            "level": "advance",
            "datasets":[
              "cifar-10", "caltech256"
            ]
          }
        ]
     }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Query datasets table fail: error-message"
     }
    ```

    ```json
    {
        "error": true,
        "message": "Query courses table fail: error-message"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
    $ curl -X POST \
      -d '{"user":"jimmy"}' \
      -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
      http://localhost:8080/v1/course/list
    {
        "error": false,
        "courses":[
          {
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "createAt": "2018-06-25T09:24:38Z",
            "name":"image process",
            "introduction" : "markdown text with escape",
            "image":"nvidia/caffe:latest",
            "gpu": 1,
            "level": "basic",
            "datasets":[
              "cifar-10"
            ]
          },
          {
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "createAt": "2018-06-25T09:24:38Z",
            "name":"image process",
            "introduction" : "markdown text with escape",
            "image":"nvidia/caffe:latest",
            "gpu": 1,
            "level": "advance",
            "datasets":[
              "cifar-10", "caltech256"
            ]
          }
        ]
     }
   ```

## Create

* **Description**
 
  Add new course information into database

* **URL**

  /v1/course/create/

* **Header:**

  `Authorization=Bearer <token-string>`


* **Method:**

  `POST`

* **URL Params**

  None

* **Data Params**

  ```json
  {
    "user": "user-name",
    "name": "course name",
    "introduction":"markdown text with escape",
    "image":"course docker image",
    "level": "basic",
    "GPU": 1,
    "datasets":[
      "mnist",
      "caltech256"
    ]
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "message" : "course <course-name> create successfully"
     }
    ```

* **Error Response:**

  * **Code:**  400 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Failed to parse spec request request: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Failed to create course information: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Failed to create course-dataset information in DB: error-message"
     }
    ```


  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
   $ curl -X POST \
     -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
     -d '{"user":"jimmy", "name":"course name","introduction":"markdown text with escape","image":"course docker image","level": "basic","GPU": 1,"datasets":["mnist","caltech256"]}' \
     http://localhost:8080/v1/course/create
   {
       "error": false,
       "message": "Course course name created successfully"
   }
   ```

## Launch
  
* **Description**
 
  Create a course deployment in kubernetes 

* **URL**

  /v1/course/launch

* **Header:**

  `Authorization=Bearer <token-string>`

* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
  {
    "course_id": "5ab02011-9ab7-40c3-b691-d335f93a12ee",
    "user": "jimmy@test2"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "job":{
          "job_id": "bf9be791-8a66-4095-862f-5a0290ce41f3",
          "ready": false,
          "status": "Created"
        }
      }
    ```

* **Error Response:**

  * **Code:**  400 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "user field in request cannot be empty"
     }
    ```
    
    ```json
    {
        "error": true,
        "message": "Failed to parse spec request request: %s"
     }
    ```    


  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Query course id %s fail: %s"
     }
    ```
        
    ```json
    {
        "error": true,
        "message": "Query course id %s required dataset fail: %s"
     }
    ```
           
    ```json
    {
        "error": true,
        "message": "create deployment for course {id = %s} fail: %s"
     }
    ```   

    ```json
    {
        "error": true,
        "message": "create service for job {id = %s} fail: %s"
     }
    ```   

    ```json
    {
        "error": true,
        "message": "update Job Table for job {id = %s} fail: %s"
     }
    ```   

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```
    

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```
    
    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```    

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```



* **Sample Call:**

  ```sh
      $ curl -X POST \
        -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
        -d '{"course_id": "e17281e1-2c16-46e8-a905-74c06592353b","user":"jimmy@nchc"}' 
        http://localhost:8080/v1/course/launch
      {
        "error": false,
        "job":{
          "job_id": "bf9be791-8a66-4095-862f-5a0290ce41f3",
          "status": "Created"
        }
      }
   ```

## Delete

* **Description**
 
  Delete course information in database

* **URL**

  /v1/course/delete/:id

* **Header:**

  `Authorization=Bearer <token-string>`


* **Method:**

  `DELETE`

* **URL Params**

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "message" : "course <name> is deleted successfully"
     }
    ```

* **Error Response:**

  * **Code:** 400  <br />
    **Content:**

    ```json
    {
      "error": true,
      "message" : "Course Id is not found"
    }
    ```

  * **Code:** 500  <br />
    **Content:**

    ```json
    {
      "error": true,
      "message" : "Failed to delete course <course-id> information : <error-message>"
    }
    ```

* **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
      $ curl -X DELETE  http://localhost:8080/v1/course/delete/1e5c1de8-26ce-424a-b906-70d8d574e7d3

      {
        "error": false,
        "message" : "Course 1e5c1de8-26ce-424a-b906-70d8d574e7d3 is deleted successfully"
      }
   ```

## List different level course


* **Description**
 
  List basic or advance courses information

* **URL**

  /v1/course/level/:level

* **Method:**

  `GET`

* **URL Params**

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
    {
        "error": false,
        "courses": [
            {
                "id": "131ba8a9-b60b-44f9-83b5-46590f756f41",
                "createAt": "2018-06-25T09:21:20Z",
                "name": "course name",
                "introduction": "markdown text with escape",
                "image": "course docker image",
                "level": "advance",
                "gpu": 1,
                "datasets": [
                    "caltech256",
                    "mnist"
                ]
            },
            {
                "id": "344694cf-9f77-4feb-8e2a-737cb6a44f2d",
                "createAt": "2018-06-25T09:21:20Z",
                "name": "course name",
                "introduction": "markdown text with escape",
                "image": "course docker image",
                "level": "advance",
                "gpu": 1,
                "datasets": [
                    "data1",
                    "mnist"
                ]
            }
        ]
    }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Query datasets table fail: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Query courses table fail: error-message"
     }
    ```

* **Sample Call:**

  ```sh
      $ curl http://localhost:8080/v1/level/advance

      {
        "error": false,
        "courses": [
            {
                "id": "131ba8a9-b60b-44f9-83b5-46590f756f41",
                "name": "course name",
                "introduction": "markdown text with escape",
                "image": "course docker image",
                "level": "advance",
                "gpu": 1,
                "datasets": [
                    "caltech256",
                    "mnist"
                ]
            },
            {
                "id": "344694cf-9f77-4feb-8e2a-737cb6a44f2d",
                "name": "course name",
                "introduction": "markdown text with escape",
                "image": "course docker image",
                "level": "advance",
                "gpu": 1,
                "datasets": [
                    "data1",
                    "mnist"
                ]
            }
        ]
      }
   ```


# Job

## List


* **Description**
 
  List all running course deployment for a user

* **URL**

  /v1/job/list

* **Header:**

  `Authorization=Bearer <token-string>`

* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
    {
      "user": "user-name"
    }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "jobs" : 
          [
              {
                "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
                "startAt": "2018-06-25T09:24:38Z",
                "status": "Ready",
                "name": "image process",
                "introduction": "markdown text with escape",
                "image": "nvidia/caffe:latest",
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
                "image":"nvidia/caffe:latest",
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
          ]
     }
    ```

* **Error Response:**

  * **Code:**  400 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Failed to parse spec request request: %s"
     }
    ```
    
    ```json
    {
        "error": true,
        "message" : "Empty user name"
     }
    ```    
    
  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Query Job table for user {%s} fail: %s"
     }
    ```
    
    ```json
    {
        "error": true,
        "message" : "Query Course info for job {%s} fail: %s"
     }
    ```
    
    ```json
    {
        "error": true,
        "message" : "Parse Service info for job {%s} fail: %s"
     }
    ```
    

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```


* **Sample Call:**

  ```sh
      $ curl -X POST -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
        -d '{"user":"jimmy@nchc"}' \ 
        http://localhost:38080/v1/job/list

     {
        "error": false,
        "jobs" : 
          [
              {
                "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
                "startAt": "2018-06-25T09:24:38Z",
                "status": "Ready",
                "name": "image process",
                "introduction": "markdown text with escape",
                "image": "nvidia/caffe:latest",
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
              }
          ]
     }
   ```

## Delete

* **TODO** 

  what is job id?

* **Description**
 
  Delete a running job deployment in user namespace

* **URL**

  /v1/job/:user/:id

* **Header:**

  `Authorization=Bearer <token-string>`


* **Method:**

  `DELETE`

* **URL Params**

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "message" : "job <id> delete successfully"
     }
    ```

* **Error Response:**

  * **Code:**  <br />
    **Content:**

    ```json

    ```


* **Sample Call:**

  ```sh
      $ curl http://localhost:8080/v1/logout

      {

      }
   ```

## IsReady

* **Description**
 
  Check Job is ready to use. (By checking deployment replica number)

* **URL**

  /v1/job/ready/:jobid

* **Header:**

  `Authorization=Bearer <token-string>`

* **Method:**

  `GET`

* **URL Params**

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "job":{
          "job_id": "bf9be791-8a66-4095-862f-5a0290ce41f3",
          "ready": true,
          "status": "Ready"
        }
      }
    ```

* **Error Response:**

  * **Code:**  400 <br />
    **Content:**

    ```json
     {
        "error": true,
        "message" : "job id is not found"
     }
    ```  
    
  * **Code:**  500 <br />
    **Content:**

    ```json
     {
        "error": true,
        "message" : "update job {%s} status fail: %s"
     }
    ```
    
    ```json
     {
        "error": true,
        "message" : "Get deployment {%s} fail: %s"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
      $ curl -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
        localhost:38080/v1/job/ready/581507e7-65c1-443a-8775-47fed28ec632

      {
         "error": false,
         "job":{
            "job_id": "581507e7-65c1-443a-8775-47fed28ec632",
            "ready": true,
            "status": "Ready"
         }
      }
   ```


# DataSet

## List

* **Description**

  List all shared data set stored in PV

* **URL**

  /v1/datasets/

* **Header:**

  `Authorization=Bearer <token-string>`

* **Method:**

  `GET`

* **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "datasets": [
            {
              "label": "dataset1",
              "value": "dataset1"
            }, 
            {
              "label": "dataset2",
              "value": "dataset2"
            }
        ]
     }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "List Kubernetes default namespace PVC fail: error message"
     }
    ```

* **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```


* **Sample Call:**

  ```sh
      $ curl -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" http://localhost:8080/v1/datasets/
      { 
        "error":false,
        "datasets":[
            {
              "label": "dataset1",
              "value": "dataset1"
            }, 
            {
              "label": "dataset2",
              "value": "dataset2"
            }          
         ]
      }
   ```


# Health Check

## check kubernetes

* **Description**

  check backend kubernetes in running

* **URL**

  /v1/health/kubernetes


* **Method:**

  `GET`

* **URL Params**

   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "message" : [{"name":"10.0.1.85","status":"Ready"}]
     }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "List Node fail: error message"
     }
    ```


* **Sample Call:**

  ```sh
      $ curl http://localhost:8080/v1/health/kubernetes

      {
        "error": false,
        "message" : [{"name":"10.0.1.85","status":"Ready"}]
      }
   ```

## check kubernetes with token

* **Description**

  check backend kubernetes in running, but required token authentication

* **URL**

  /v1/health/kubernetesAuth


* **Method:**

  `GET`

* **Header:**
  `Authorization=Bearer <token-string>`

* **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "message" : [{"name":"10.0.1.85","status":"Ready"}]
     }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "List Node fail: error message"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
      $ curl -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" http://localhost:8080/v1/health/kubernetesAuth

      {
        "error": false,
        "message" : [{"name":"10.0.1.85","status":"Ready"}]
      }
   ```

## check database

* **Description**

  Check backend database is running

* **URL**

  /v1/health/database


* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
  {
    "message": "test"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
    {
        "error": false,
        "message": "test",
        "tables": [
            "course"
        ]
    }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Query all table name fail: error-message"
     }
    ```


* **Sample Call:**

  ```sh
    $ curl -X POST -d '{"message": "xs"}' http://localhost:8080/v1/health/database

    {"error":false,"message":"xs","tables":["course"]}
   ```

## check database with token

* **Description**

  Check backend database is running, but required token authentication

* **URL**

  /v1/health/databaseAuth

* **Header:**

  `Authorization=Bearer <token-string>`

* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
  {
    "message": "test"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
    {
        "error": false,
        "message": "test",
        "tables": [
            "course"
        ]
    }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Query all table name fail: error-message"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
    $ curl -X POST -d '{"message": "xs"}' -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" http://localhost:8080/v1/health/databaseAuth

    {"error":false,"message":"xs","tables":["course"]}
   ```


# Proxy

## Token

* **Description**

  Exchange token from Provider

* **URL**

  /v1/proxy/token


* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
    {
      "code": "xxxxxxx"
    }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "token": "045e8bd5-58dc-4bd5-8254-dc3d1571c9cd",
        "refresh_token": "7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"     }
    ```

* **Error Response:**

  * **Code:**  400 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Failed to parse spec request request: error message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Exchange Token fail: error"
     }
    ```

* **Sample Call:**

  ```sh
      $ curl -X POST \
        -d '"{"code":"xxxxxx"}"' \
        http://localhost:8080/v1/proxy/token

     {
        "token": "045e8bd5-58dc-4bd5-8254-dc3d1571c9cd",
        "refresh_token": "7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"     
     }
   ```

## Refresh

* **Description**

  Refresh token with provider

* **URL**

  /v1/proxy/refresh


* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
    {
      "refresh_token": "7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"
    }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
      "token": "045e8bd5-58dc-4bd5-8254-dc3d1571c9cd",
      "refresh_token": "7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"
     }
    ```

* **Error Response:**

  * **Code:**  400 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Failed to parse spec request request: error message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Exchange Token fail: error"
     }
    ```

* **Sample Call:**

  ```sh
      $ curl -X POST \
        -d '"{"refresh_token":"7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"}"' \
        http://localhost:8080/v1/proxy/refresh

     {
        "token": "045e8bd5-58dc-4bd5-8254-dc3d1571c9cd",
        "refresh_token": "7e7f6442-09e0-44f3-a05b-d7ea516cc6c5"
     }
   ```


# Image

## List


* **Description**

  check backend kubernetes in running, but required token authentication

* **URL**

  /v1/images/

* **Method:**

  `GET`

* **Header:**

  `Authorization=Bearer <token-string>`

* **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "images" : [
          {
              "label": "repo_name/img_name:tag",
              "value": "repo_name/img_name:tag"
          }, 
          {
              "label": "repo_name/img_name:tag",
              "value": "repo_name/img_name:tag"
          }
        ]
     }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "List Node fail: error message"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is missing"
     }
    ```

  * **Code:**  401 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "Authorization header is not Bearer Token format or token is missing"
     }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Invalid API token"
       }
    ```

  * **Code:**  403 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "Access token expired"
      }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
      {
          "error": true,
          "message" : "verify token fail: error message"
      }
    ```

* **Sample Call:**

  ```sh
      $ curl -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
        http://localhost:8080/v1/images/
    
      {
        "error": false,
        "images": [
          {
            "label": "tensorflow/tensorflow:1.5.1",
            "value": "tensorflow/tensorflow:1.5.1"
          },
          {
            "label": "nvidia/digits5.0",
            "value": "nvidia/digits5.0"
          }
        ]
      }
   ```