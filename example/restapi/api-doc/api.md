**Get Deployment Replica number**
----
  Returns json data about a replica number.

* **URL**

  /getPod

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
        "message" : "There are 0 pods in the default namespace"
     }
    ```

* **Error Response:**

  * **Code:** 500 Internal Server Error <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Failed to parse spec request request: "
    }
    ```


* **Sample Call:**

  ```sh
      $ curl http://localhost:8080/getPod

      {
         "message" : "There are 0 pods in the default namespace"
      }
   ```

**Create Deployment**
----
  Create deployment with different replica number.

* **URL**

  /createDeploy

* **Method:**

  `POST`

*  **URL Params**

   None

* **Data Params**

  **Required:**

  ```json
  {
    "replica": 3
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```json
    {
        "message" : "Created deployment demo-deployment-xjauh"
    }
    ```

* **Error Response:**

  * **Code:** 400 Bad request <br />
    **Content:**

    ```json
    {
        "error": true,
        "cause": "Failed to parse spec request request: "
    }
    ```


  * **Code:** 500 Internal Server Error <br />
    **Content:**

    ```json
    {
        "error" : true,
        "cause": "Create deployment fail: deployments.apps \"demo-deployment\" already exists""
    }
    ```

* **Sample Call:**

  ```sh
    $ curl -X POST -d '{"replica": 4 }' http://127.0.0.1:8080/createDeploy

    {
       "message":"Created deployment demo-deployment"
    }
  ```