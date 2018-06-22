<!--ts-->
   * [Course](#course)
      * [X] [List](#list)
      * [X] [Create](#create)
      * [ ] [Launch](#launch)
      * [ ] [Delete](#delete)
      * [X] [List different level course](#list-different-level-course)
   * [Job](#job)
      * [ ] [List](#list-1)
      * [ ] [Delete](#delete-1)
   * [DataSet](#dataset)
      * [ ] [List](#list-2)
   * [Health Check](#health-check)
      * [X] [check kubernetes](#check-kubernetes)
      * [X] [check kubernetes with token](#check-kubernetes-with-token)
      * [X] [check database](#check-database)
      * [X] [check database with token](#check-database-with-token)

<!-- Added by: ogre0403, at:  -->

<!--te-->

# Course

## List

* **TODO** 

  how to get student course list? Do we have different query logic for teacher and student 
  
* **Description**
 
  List user's all courses information

* **URL**

  /v1/course/list/:user

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
        "courses":[
          {
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
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
        "cause": "Query datasets table fail: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Query courses table fail: error-message"
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



* **Sample Call:**

  ```sh
    $ curl -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
      http://localhost:8080/v1/course/list/jimmy
    {
        "error": false,
        "courses":[
          {
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
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

  /v1/course/create/:user

* **Header:**

  `Authorization=Bearer <token-string>`


* **Method:**

  `POST`

* **URL Params**

  None

* **Data Params**

  ```json
  {
    "name":"course name",
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
        "cause": "Failed to parse spec request request: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Failed to create course information: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Failed to create course-dataset information in DB: error-message"
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


* **Sample Call:**

  ```sh
   $ curl -X POST \
     -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" \
     -d '{"name":"course name","introduction":"markdown text with escape","image":"course docker image","level": "basic","GPU": 1,"datasets":["mnist","caltech256"]}' \
     http://localhost:8080/v1/course/create/jimmy
   {
       "error": false,
       "message": "Course course name created successfully"
   }
   ```

## Launch

* **TODO** 

  check all required fields to create deployment?
  
  each deployment is in their own namespace?

* **Description**
 
  Create a course deployment in kubernetes 

* **URL**

  /v1/course/:user

* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
  {
    "":"",
    "":""
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error": false,
        "message" : "Launch deployment <deployment name> successfully"
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

## Delete

* **TODO** 

  do we need to delete course ?
  what is course id ?

* **Description**
 
  Delete course information in database

* **URL**

  /v1/course/:user/:id

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
        "message" : "course <name> delete successfully"
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

## List different level course


* **Description**
 
  List basic or advance courses information

* **URL**

  /v1/level/:level

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

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Query datasets table fail: error-message"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Query courses table fail: error-message"
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

* **TODO** 


* **Description**
 
  List all running course deployment for a user

* **URL**

  /v1/job/:user

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
        "jobs" : 
          [{
            "status": "",
            "job_id": 1,
            "course_name":"影像處理",
            "image":"nvidia/caffe:latest", 
            "dataset":[
              "cifar-10","mnist"
            ]
          },
          {
            "status": "",
            "job_id": 2,
            "course_name":"影像處理",
            "image":"nvidia/caffe:latest", 
            "dataset":[
              "cifar-10","mnist"
            ]
          }
        ]
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


## Delete

* **TODO** 

  what is job id?

* **Description**
 
  Delete a running job deployment in user namespace

* **URL**

  /v1/job/:user/:id


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

# DataSet

## List

* **Description**

  List all available data set stored in PV

* **URL**

  /v1/datasets/


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
        "message" : {"dataset":["mnist", "caltech256"]}
     }
    ```

* **Error Response:**

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "XXXXXXXXX"
     }
    ```

  * **Code:**  500 <br />
    **Content:**

    ```json
    {
        "error": true,
        "message" : "verify token process fail: error message"
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


* **Sample Call:**

  ```sh
      $ curl -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" http://localhost:8080/v1/health/kubernetesAuth

      {
        "error": false,
        "message" : [{"name":"10.0.1.85","status":"Ready"}]
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


* **Sample Call:**

  ```sh
    $ curl -X POST -d '{"message": "xs"}' -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" http://localhost:8080/v1/health/databaseAuth

    {"error":false,"message":"xs","tables":["course"]}
   ```
