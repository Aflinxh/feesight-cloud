# Firebase Authentication & User Profile API
This API manages user authentication and profile information storage using Firebase Authentication and Firestore. It facilitates secure authentication and storage of user profiles, allowing users to sign up, log in, edit their profiles, and retrieve profile details.

## Acces Our Deployed API
[auth-api](https://auth-api-lxntso327q-et.a.run.app/)

## Table Of Contents

1. [Firebase Authentication API](#firebase-authentication-api)
   - [Create Account (`POST /signup`)](#create-account-post-signup)
   - [Login (`POST /login`)](#login-post-login)
   - [Logout (POST /logout)](#logout-postlogout)
2. [User Profile API](#user-profile-api)
   - [Update User Profile (`PUT /user/`)](#update-user-profile-put-user)
   - [Delete User Profile (`DELETE /User`)](#delete-user-profile-delete-user)
3. [Transaction](#transaction)
   - [Create Transactions (`POST /user/transactions`)](#create-transactions-post-usertransactions)
   - [Update Transactions (`PUT /user/transactions`)](#update-transactions-put-usertransactions)
   - [Delete Transactions (`DELETE /user/transactions`)](#delete-transactions-delete-usertransactions)
   - [Check Balance (`GET /user/balance?toDate=YOUR_DATE_HERE`)](#check-balance-get-user-balance-todateyour_date_here)
   - [Spare Money (`GET /user/spareMoney?toDate=YOUR_DATE_HERE`)](#spare-money-get-usersparemoneytodateyour_date_here)
   - [Predict Asset Price (`POST /predict`)](https://your-api-url/predict)
4. [Preparation and Prerequisites](#preparation-and-prerequisites)
   - [Creating a Project in Google Cloud](#creating-a-project-in-google-cloud)
   - [Generating a Firebase Service Account](#generating-a-firebase-service-account)
   - [Accessing Firebase Web App Configuration](#accessing-firebase-web-app-configuration)
5. [Running the Application Locally](#running-the-application-locally)
   - [Cloning the Repository](#cloning-the-repository)
   - [Installing Requirements](#installing-requirements)
   - [Installing Requirements for node.js](#installing-requirements)
   - [Run the Server](#run-the-server)
6. [Deploying the Application to Cloud Run](#deploying-the-application-to-cloud-run)

## Endpoint Description
### Create Account (`POST /signup`)
Creates a new user account with Firebase authentication and adds user profile details to Firestore.

#### Request:
- **Endpoint:** `/signup`
- **Method:** `POST`
- **Request Body (JSON):** 
    ```json
    {
     "email" :"user999@gmail.com",
     "password" : "user123",
     "displayName" : "user999"
    }
    ```

#### Responses:
- **Success (201):** Account created successfully.
    ```json
    {
    "id": "SlAl2zgDQ3WfKpFph7FFSImgJNP2",
    "email": "user999@gmail.com",
    "displayName": "user999",
    "passwordHash": "your_passwoard"
    }
    ```
- **Error (400):** Email already in use.
- **Error (500):** Internal server error.

### Login (`POST /login`)
Authenticates user credentials and generates an access token.

#### Request:
- **Endpoint:** `/login`
- **Method:** `POST`
- **Request Body (JSON):** 
    ```json
    {
      "email" :"user8@gmail.com",
      "password" : "user123"
    }
    ```

#### Responses:
- **Success (200):** Login successful.
    ```json
    {
       "message": "Login successful",
       "token": "access_token",
    }
    ```
- **Error (400):** Invalid credentials.

---


### Update User Profile (`PUT /user`)
Updates user profile details in Firestore.

#### Request:
- **Endpoint:** `/user`
- **Method:** `PUT`
- **Request Body (Form Data):** 
    - `username` (optional): New username.
    - `displayName` (optional): New diplayname.

#### Responses:
- **Success (200):** User profile updated successfully.
    ```json
    {
    "email" :"user9@gmail.com",
    "displayName" : "user9"
    }
    ```
- **Error (404):** User profile not found.
- **Error (500):** Internal server error.

---

### Delete User Profile (`DELETE /user`)
 delete user details in Firestore.
 
 #### Request:
- **Endpoint:** `/user`
- **Method:** `DELETE`
- **Request Headers (Authorization):** 
      - Authorization : "your_token"

#### Responses:
- **Success (200):** Delete user successfully.
    ```json
    
    {
        "message": "User deleted successfully"
    }
    ```
 ---

### Create Transactions (`POST /user/transactions`)
 create transactions details in Firestore.
 #### Request:
- **Endpoint:** `/user/transactions`
- **Method:** `POST`
- **Request Body (JSON):** 
     ```json
    
    {
       "amount": 1000000,
       "type": "income",
       "category": "salary",
       "date": "2024-05-29T14:30:00Z"

    }

#### Responses:
- **Success (200):** Transaction successfully.
    ```json
    {
    
    "message": "Transaction performed",
    "id": "nTaMeFxIEpH6FkTcloVL"
    
    }

---
### Update Transactions (`PUT /user/transactions`)
 Update transactions details in Firestore.
 
 #### Request:
- **Endpoint:** `/user/transaction`
- **Method:** `PUT`
- **Request Body (Form Data):** 
    - `amount` (optional): New amount.
    - `type` (optional): New type.
    - `category` : New category.

#### Responses:
- **Success (200):** Updated  transaction successfully.
    ```json
    {
    "message": "Transaction updated successfully"
    }
    ```
---

### Delete Transactions (`DELETE /user/transactions`)
 delete transactions details in Firestore.
 
 #### Request:
- **Endpoint:** `/user/transaction`
- **Method:** `DELETE`
- **Request Body (JSON):** 
     ```json
    
    {
       "id": "Ad1GkC7K1iZcd4mkFtTC"
    }

#### Responses:
- **Success (200):** Delete transaction successfully.
    ```json
    
    {
    "message": "Transaction updated successfully"
    }
    ```
---

### Check Balance (`GET/user/balance?toDate=YOUR_DATE_HERE)
check balance in spesific date

 #### Request:
- **Endpoint:** `/user/balance?toDate=YOUT_DATE_HERE`
- **Method:** `GET`
- **Request Params :** 
     -`toDate` : "YOUR_DATE_HERE"

#### Responses:
- **Success (200):** Check balance successfully.
    ```json
    
    {
     "balance": 600000
    }
    ```
---

### Spare Money (`GET/user/spareMoney?toDate=YOUR_DATE_HERE)
check spare money balance in spesific use.

 #### Request:
- **Endpoint:** `/user/spareMoney?toDate=YOUT_DATE_HERE`
- **Method:** `GET`
- **Request Params :** 
     -date : "YOUR_DATE_HERE"

#### Responses:
- **Success (200):** spare money successfully.
    ```json
    
    {
     "balance": 600000
    }
    ```
---

### Predict Asset Price (`POST/predict`)
 predict the stocks or crypto in a spesific date
 
 #### Request:
- **Endpoint:** `/predict`
- **Method:** `POST `
- **Request Body (JSON):**
     ```json
    
    {
    "end_date" : "2024-06-20"
     }

#### Responses:
 **Success (200):** predict successfully.
    ```json

    {
    "BNB-USD": 598.0254488287279,
    "NEAR-USD": 5.242614952962325,
    "SOL-USD": 144.54741345163546,
    "LINK-USD": 14.048344498867941,
    "ETH-USD": 3375.613500343675,
    "BBCA.JK": 9555.906373093316,
    "BBRI.JK": 4256.878264446494,
    "INDF.JK": 5898.3795837017715,
    "TLKM.JK": 2825.6966301286125,
    "AMZN": 176.97314501889915
    }
    ```
---

 ### Logout (`POST/logout`)
 logout user for app.
 
 #### Request:
- **Endpoint:** `/logout`
- **Method:** `POST`
- **Request Headers :** 
      - `Authorization` : "your_token"

#### Responses:
- **Success (200):** Logout successfully.
    ```json
    
    {
     "message": "Logout successful"
    }
    ```

## Preparation and Prerequisites

### Setting Up the Project in Google Cloud

1. **Creating a Project in Google Cloud**
    - Open [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project or use an existing one for Firebase.

2. **Generating a Firebase Service Account**
    - Access [Firebase](console.firebase.google.com). Select the project
    - Go to **Settings > Service accounts** in Firebase.
    - Create a service account and generate a new private key,select node.js and click generate a new private key.

3. **Accessing Firebase Web App Configuration**
    - Check your downloaded private key.
    - Rename the file to serviceAccountKey.json.
    - Copy the file to the root directory.
    - Update your code to use these defined variables for Firebase interactions.
   
      ```
      {
          "apiKey": "yourAPIkey",
          "authDomain": "XXXX.firebaseapp.com",
          "projectId": "xxxxxxxxx",
          "storageBucket": "xxxxxxxx",
          "messagingSenderId": "xxxxxxxxxx",
          "appId": "xxxxxxxxxx",
          "databaseURL": ""
      }
      ```

## Running the Application Locally

1. **Cloning the Repository**
    ```bash
    git clone https://github.com/Aflinxh/feesight-cloud
    cd feesight-cloud
    ```

2. **Installing Requirements**

    ```bash
    pip install -r requirements.txt
    ```
3. **Installing Requirements for node.js**
   ```bash
    npm i
    ```
4. **Run the Server**
   ```bash
    npm run start
    ```

## Deploying the Application to Cloud Run
```bash
# Cloning the Repository
git clone <repository_url>

# Change to the destined directory
cd <project_folder>

# Create a Artifact Registry
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable the Artifact Registry API
gcloud services enable artifactregistry.googleapis.com

# Create the Artifact Registry
gcloud artifacts repositories create feesight-cloud \
    --repository-format=docker \
    --location=YOUR_LOCATION \
    --description="Artifact Registry for Feesight Cloud"

# Build Docker image
docker build -t YOUR_IMAGE_PATH:v2 .

# Create a new tag for an existing Docker image to the Artifact Repository
docker tag YOUR_TAG_NAME:v2 YOUR_LOCATION-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPOSITORY_NAME/image:latest

# Upload a local Docker image to a remote repository.
docker push YOUR_LOCATION-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPOSITORY_NAME/image:latest


```
## Developer
- [Ronal Pandapotan Simbolon](https://github.com/RolloPanda)
- [Angelina Priskila Laowoi](https://github.com/Angelinapriskila)

## Other Contributor
- [Alfin Gusti Alamsyah](https://github.com/Aflinxh)
