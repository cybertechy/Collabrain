# Backend

## API Endpoints

## Storage Endpoints

### `/api/storage/media`

API endpoint for adding media to the storage bucket.

- Request Type: `POST`

- Request Body: 
    - `token` - JWT token for authentication
    - `MIMEtype` - MIME type of the media
    - `data` - Base64 encoded data of the media

- Response:
    - `code` - System code for the response
    - `message` - System message for the response
    - `mediaID` - ID of the media in the storage bucket

- System Codes:
    - `AM101` - This indicates that the token was not found in the request body
    - `AM102` - This indicates that the token was invalid
    - `AM103` - This indicates that the MIME type was not found in the request body Or the MIME type was invalid
    - `AM104` - This indicates that the data was not found in the request body
    - `AM105` - This indicates that the data was of invalid format
    - `AM106` - This indicates that the media size exceeds 10MB
    - `AM107` - This indicates that the media could not be uploaded to the storage bucket
    - `AM200` - This indicates that the media was successfully uploaded to the storage bucket



### `/api/storage/media/:mediaID?token=`

API endpoint for getting media from the storage bucket.

- Request Type: `GET`

- Request Params: 
    - `token` - JWT token for authentication

- Request ID
    - `mediaID` - ID of the media in the storage bucket

- Response:
    - `code` - System code for the response
    - `message` - System message for the response
    - `MIMEtype` - MIME type of the media
    - `datalength` - Length of the data in bytes
    - `data` - Base64 encoded data of the media

- System Codes:
    - `GM101` - This indicates that the token was not found in the request body
    - `GM102` - This indicates that the token was invalid
    - `GM103` - This indicates that the mediaID was not found in the request body
    - `GM104` - This indicates that the mediaID is invalid for the user
    - `GM105` - This indicates that the media could not be fetched from the storage bucket
    - `GM200` - This indicates that the media was successfully fetched from the storage bucket
