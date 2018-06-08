# Authentication

## Login

* **TODO** 

  plain password text ?

* **Description**
 
  User login

* **URL**

  /v1/login

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
        "message" : "login successfully"
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
## Logout

* **TODO** 

  do we have session id ?

* **Description**
 
  User logout

* **URL**

  /v1/logout

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
        "message" : "Logout successfully"
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
        "error": false,
        "message" : "Logout successfully"
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

# Job

## List

* **TODO** 

  what we have in status?
  do we need job id ?


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