# Firebase Authentication & User Profile API
This API manages user authentication and profile information storage using Firebase Authentication and Firestore. It facilitates secure authentication and storage of user profiles, allowing users to sign up, log in, edit their profiles, and retrieve profile details.

## Acces Our Deployed API
[auth-api](https://auth-api-lxntso327q-et.a.run.app/)

## Table Of Contents

1. [Firebase Authentication API](#firebase-authentication-api)
   - [Create Account (`POST /signup`)](#create-account-post-signup)
   - [Login (`POST /login`)](#login-post-login)
   - [Validate Token (`POST /ping`)](#validate-token-post-ping)
2. [User Profile API](#user-profile-api)
   - [Get User Profile (`GET /userProfile/{user_id}`)](#get-user-profile-get-userprofileuser_id)
   - [Update User Profile (`PUT /userProfile/{user_id}`)](#update-user-profile-put-userprofileuser_id)
   - [Test Upload to Cloud Storage (`POST /upload`)](#test-upload-to-cloud-storage-post-upload)
3. [Preparation and Prerequisites](#preparation-and-prerequisites)
   - [Setting Up the Project in Google Cloud](#setting-up-the-project-in-google-cloud)
   - [Configuration for Cloud Storage](#configuration-for-cloud-storage)
   - [Authenticate to Secret Manager Locally](#authenticate-to-secret-manager-locally)
4. [Running the Application Locally](#running-the-application-locally)
   - [Documentation and Testing](#documentation-and-testing)
5. [Deploying the Application to Cloud Run](#deploying-the-Application-to-Cloud-Run)

## Endpoint Description
### Create Account (`POST /signup`)
Creates a new user account with Firebase authentication and adds user profile details to Firestore.

#### Request:
- **Endpoint:** `/signup`
- **Method:** `POST`
- **Request Body (JSON):** 
    ```json
    {
        "email": "example@example.com",
        "password": "your_password",
        "username": "user123",
        "address": "123 Street, City"
    }
    ```

#### Responses:
- **Success (201):** Account created successfully.
    ```json
    {
        "user_id": "user_uid",
        "message": "Akun berhasil dibuat user_uid"
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
        "email": "example@example.com",
        "password": "your_password"
    }
    ```

#### Responses:
- **Success (200):** Login successful.
    ```json
    {
        "token": "access_token",
        "user_id": "user_uid"
    }
    ```
- **Error (400):** Invalid credentials.

### Validate Token (`POST /ping`)
Validates the access token and returns user details.

#### Request:
- **Endpoint:** `/ping`
- **Method:** `POST`
- **Request Header:** `authorization: Bearer your_access_token`

#### Response:
- **Success (200):** User details.

---


## User Profile API

### Get User Profile (`GET /userProfile/{user_id}`)
Retrieves user profile details based on the provided user ID.

#### Request:
- **Endpoint:** `/userProfile/{user_id}`
- **Method:** `GET`
- **Path Parameters:**
    - `user_id`: ID of the user to retrieve profile details for (String).

#### Responses:
- **Success (200):** User profile details in JSON format.
    ```json
    {
        "user_id": "************",
        "email": "*****@****.com",
        "address": "********",
        "creationDate": "************",
        "username": "*****",
        "photo": "https://storage.googleapis.com/***********/*****.jpg"
    }
    ```
- **Error (404):** User profile not found.
- **Error (500):** Internal server error.


### Update User Profile (`PUT /userProfile/{user_id}`)
Updates user profile details in Firestore.

#### Request:
- **Endpoint:** `/userProfile/{user_id}`
- **Method:** `PUT`
- **Request Body (Form Data):** 
    - `username` (optional): New username.
    - `address` (optional): New address.
    - `file` (optional): New profile picture (Upload file).

#### Responses:
- **Success (200):** User profile updated successfully.
    ```json
    {
        "message": "Profil pengguna berhasil diperbarui"
    }
    ```
- **Error (404):** User profile not found.
- **Error (500):** Internal server error.

  ### Test Upload to Cloud Storage (`POST /upload`)
Uploads an image to Google Cloud Storage (GCS) for testing purposes.

#### Request:
- **Endpoint:** `/upload`
- **Method:** `POST`
- **Request Body (Form Data):** 
    - `photo`: Image file to upload (Upload file).

#### Responses:
- **Success (200):** File uploaded successfully.
    ```json
    {
        "file_path": "URL_to_uploaded_file"
    }
    ```
- **Error (500):** Internal server error.

---

## Preparation and Prerequisites

### Setting Up the Project in Google Cloud

1. **Creating a Project in Google Cloud**
    - Open [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project or use an existing one for Firebase.

2. **Generating a Firebase Service Account**
    - Access [Firebase](console.firebase.google.com). Select the project
    - Go to **Settings > Service accounts** in Firebase.
    - Create a service account and store it in Secret Manager with the name `firebase_sak`.

3. **Accessing Firebase Web App Configuration**
    - Go to your Firebase project's overview.
    - Add or create a web app.
    - Access the web app and copy the `firebaseConfig` value.
    - Modify the `firebaseConfig` value by adding `"databaseURL": ""` and save it to Secret Manager as `firebase_config`. The complete value should look like:
      ```json
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

### Configuration for Cloud Storage

1. **Creating a Service Account for Cloud Storage**
    - Create a service account and generate the service account key and store it in Secret Manager as `scancare-user-profile_bucket_sak`.

2. **Setting Bucket Access**
    - Create a public bucket in Cloud Storage.
    - Grant the storage admin role to the service account in the created bucket.

### Authenticate to Secret Manager Locally
(If you want to run the application locally)

1. **Installing Google Cloud SDK**
    - Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).

2. **Logging into Google Cloud**
    - Run the following command for authentication:
      ```bash
      gcloud auth application-default login
      ```
## If you dont want to use secret manager with less secure method for Local Development

If you choose to use this method for local development, here are the steps:

1. **Adding Firebase Service Account:**
    - Place the Firebase Service Account Key (JSON file) in the same folder as the main Python file.
    - Define the path to the Firebase Service Account file in your code:
        ```
        firebaseSak = 'your_firebase_sak_file.json'  # Update with the actual file name
        ```

2. **Updating Firebase Configuration:**
    - Replace the `firebaseConfig` variable with the Firebase configuration value directly in your code:
        ```
        firebaseConfig = {
            "apiKey": "yourAPIkey",
            "authDomain": "XXXX.firebaseapp.com",
            "projectId": "xxxxxxxxx",
            "storageBucket": "xxxxxxxx",
            "messagingSenderId": "xxxxxxxxxx",
            "appId": "xxxxxxxxxx",
            "databaseURL": ""
        }
        ```

3. **Adding Cloud Storage Service Account:**
    - Place the Cloud Storage Service Account Key (JSON file) in the same folder as the main Python file.
    - Define the path to the Cloud Storage Service Account file in your code:
        ```
        key = 'your_bucket_service_account_key.json'  # Update with the actual file name
        ```

4. **Code Adjustment:**
    - Update your code to use these defined variables for Firebase and Cloud Storage interactions.

Please note that this method is less secure and not recommended for production environments. Always follow best practices for handling sensitive data, especially when deploying applications.
## Running the Application Locally

1. **Cloning the Repository**
    ```bash
    git clone <repository_url>
    cd <project_folder>
    ```

2. **Installing Requirements**
    ```bash
    pip install -r requirements.txt
    ```

3. **Modifying Access to Secret Manager**
   - Navigate to `main.py`.
   - Find these sections:
     ```python
     firebaseSak = access_secret_version('YOUR_PROJECT_ID', 'firebase_sak','1')
     ```
     ```python
     firebaseConfig = access_secret_version('YOUR_PROJECT_ID', 'firebase_config','1')
     ```
     ```python
     key = access_secret_version('YOUR_PROJECT_ID', 'scancare-user-profile_bucket_sak','1')
     ```
   - Update `YOUR_PROJECT_ID` with your Google Cloud project ID.

6. **Running the FastAPI Application**
    - Update the run configuration in `main.py`:
      
        ```python
        port = int(os.environ.get('PORT', 8000)) # Use any desired port number
        print(f"Listening to http://localhost:{port}")
        uvicorn.run(app, host='localhost', port=port) 
        ```
        
7. **Starting the Local Server**
    ```bash
    uvicorn main:app --reload
    ```

8. **Accessing the API**
    - Utilize the provided API endpoints as documented earlier.

---

### Testing With FastAPI Swagger UI
- View Swagger UI: `http://localhost:8000/docs` on your browser


## Deploying the Application to Cloud Run
```bash
# Cloning the Repository
git clone <repository_url>

# Change to the destined directory
cd <project_folder>

# Create a Docker Artifact Repository in a specified region
gcloud artifacts repositories create YOUR_REPOSITORY_NAME --repository-format=docker --location=YOUR_REGION

# Build Docker image for the ML API
docker buildx build --platform linux/amd64 -t YOUR_IMAGE_PATH:YOUR_TAG --build-arg PORT=8080 .

# Push the Docker image to the Artifact Repository
docker push YOUR_IMAGE_PATH:YOUR_TAG

# Deploy the Docker image to Cloud Run with allocated memory
gcloud run deploy --image YOUR_IMAGE_PATH:YOUR_TAG --memory 3Gi

# Fetching the service account associated with the newly deployed Cloud Run service
SERVICE_ACCOUNT=$(gcloud run services describe YOUR_SERVICE_NAME --platform=managed --region=YOUR_REGION --format="value(serviceAccountEmail)")

# Grant necessary IAM roles to the service account linked to the Cloud Run service
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID --member=serviceAccount:${SERVICE_ACCOUNT} --role=roles/secretmanager.secretAccessor

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID --member=serviceAccount:${SERVICE_ACCOUNT} --role=roles/cloudsql.client
```
## Developer
- [Ni Putu Adnya Puspita Dewi](https://github.com/adnyaaa)
- [Tsania Magistra Rahma Insani](https://github.com/tsaniamagistra)
