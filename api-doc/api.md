<!--ts-->
   * [Course](#course)
      * [List](#list)
      * [Add](#add)
      * [Launch](#launch)
      * [Delete](#delete)
      * [List basic course](#list-basic-course)
      * [List advanced course](#list-advanced-course)
   * [Job](#job)
      * [List](#list-1)
      * [Delete](#delete-1)
   * [Health Check](#health-check)
      * [check kubernetes](#check-kubernetes)
      * [check kubernetes with token](#check-kubernetes-with-token)
      * [check database](#check-database)
      * [check database with token](#check-database-with-token)

<!-- Added by: ogre0403, at:  -->

<!--te-->

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
        "message" : "token is missing"
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
    $ curl -X POST -d '{"message": "xs"}' -H "Authorization: Bearer b86b2893-b876-45c2-a3f6-5e099c15d638" http://localhost:8080/v1/health/databaseAuth

    {"error":false,"message":"xs","tables":["course"]}
   ```
