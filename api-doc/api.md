* [Authentication](#authentication)
  * [Register](#register)
  * [Delete](#delete)
* [Course](#course)
  * [List](#list)
  * [Add](#add)
  * [Launch](#launch)
  * [Delete](#delete-1)
  * [List basic course](#list-basic-course)
  * [List advanced course](#list-advanced-course)
* [Job](#job)
  * [List](#list-1)
  * [Delete](#delete-2)
* [Health Check](#health-check)
  * [check kubernetes](#check-kubernetes)
  * [check database](#check-database)

# Authentication

## Register

* **TODO**

  require authorization ?

* **Description**

  create a new user

* **URL**

  /v1/auth/register

* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

    ```json
    {
        "username": "username",
        "password": "password"
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error" : false,
        "message" : "register successfully"
     }
    ```

* **Error Response:**

  * **Code:** 401 Unauthorized <br />
    **Content:**



* **Sample Call:**

  ```sh
      $ curl -X POST -d '{"username": "username", "password": "password" }' http://127.0.0.1:8080/v1/login

      {
        "error" : false,
        "message" : "login successfully"
      }
   ```

## Delete

* **TODO**

  require authorization ?

* **Description**

  Delete a user

* **URL**

  /v1/auth/delete

* **Method:**

  `DELETE`

* **URL Params**

   None

* **Data Params**

    ```json
    {
        "id": "user-id",
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
     {
        "error" : false,
        "message" : "user <user-id> is deleted successfully"
     }
    ```

* **Error Response:**

  * **Code:** 401 Unauthorized <br />
    **Content:**

    ```json
    {
        "error": true,
        "message": "Unauthorized User login"
    }
    ```


* **Sample Call:**

  ```sh
      $ curl -X POST -d '{"username": "username", "password": "password" }' http://127.0.0.1:8080/v1/login

      {
        "error" : false,
        "message" : "login successfully"
      }
   ```

# Course

## List

* **TODO** 

  Check course detail information ?

  how to get student course list? Do we have different query logic for teacher and student 
  
* **Description**
 
  List user's all courses information

* **URL**

  /v1/course/:user

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
            "course_id": 1,
            "course_name":"影像處理",
            "image":"nvidia/caffe:latest", 
            "dataset":[
              "cifar-10","mnist"
            ]
          },
          {
            "course_id": 2,
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
      $ curl http://localhost:8080/v1/course/serena

      {

      }
   ```

## Add

* **TODO** 

  description is long markdown, not short plain text ?

* **Description**
 
  Add new course information into database

* **URL**

  /v1/course/:user

* **Method:**

  `POST`

* **URL Params**

   None

* **Data Params**

  ```json
  {
    "course_name":"",
    "description":"",
    "image":"",
    "dataset":[
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
        "message" : "course <id> is create successfully"
     }
    ```

* **Error Response:**

  * **Code:**  <br />
    **Content:**

    ```json

    ```


* **Sample Call:**

  ```sh
      $ curl -X POST -d '{"",""} 'http://localhost:8080/v1/course

      {

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

## List basic course

* **TODO** 

  list course by user ?

* **Description**
 
  List all basic courses

* **URL**

  /v1/course/basic


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
            "level", "basic",
            "course_id": 1,
            "course_name":"影像處理",
            "image":"nvidia/caffe:latest", 
            "dataset":[
              "cifar-10","mnist"
            ]
          },
          {
            "level", "basic",
            "course_id": 2,
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
      $ curl http://localhost:8080/v1/course/basic

      {

      }
   ```


## List advanced course

* **TODO** 

  

* **Description**
 
  List all advanced courses

* **URL**

  /v1/course/advanced

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
            "level", "advanced",
            "course_id": 1,
            "course_name":"影像處理",
            "image":"nvidia/caffe:latest", 
            "dataset":[
              "cifar-10","mnist"
            ]
          },
          {
            "level", "advanced",
            "course_id": 2,
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
      $ curl http://localhost:8080/v1/course/advanced

      {

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
          {
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
