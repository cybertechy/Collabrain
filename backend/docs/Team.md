# API Reference for Team based endpoints

## Endpoint: /api/teams/team

### GET

#### Description

Gets the information for a team

#### Request

- Headers

  - Authorization: Bearer <JWT Token>

- Query Parameters

  - teamID: The id of the team to get

#### Response

- Status Codes

  - 200: Successfully got the team
  - 400: Bad request
  - 401: Unauthorized
  - 404: Team not found

- Body

    - teamID: The id of the team
    - teamName: The name of the team
    - owner: The information of the owner of the team
            - uid: The id of the owner
            - fname: The first name of the owner
            - lname: The last name of the owner
    - MIMEtype: The MIME type of the team's profile picture  (null if no profile picture)
    - teamImageID: The id of the team's profile picture (null if no profile picture)
    - members: The information of the members of the team as Objects, keys are the member's id
        - role: The role of the member
        - fname: The first name of the member
        - lname: The last name of the member
        - email: The email of the member
        - status: The status of the member
    - channels: An object with the channel name as key
        - channelID: The id of the channel
        - channelName: The name of the channel
    - Visibility: The visibility of the team
    - Score: The score of the team
    - creationDate: The date the team was created
    - lastUpdated: The date the team was last updated

### POST

#### Description

Creates a new team


#### Request

- Headers

   - Authorization: Bearer <JWT Token>

- Body

    - teamName: The name of the team
    - Visibility: The visibility of the team (Optional, Default: public)
    - teamImageID: The id of the team's profile picture (Optional)
    - MIMEtype: The MIME type of the team's profile picture  (Optional)

#### Response

- Status Codes

  - 201: Successfully created the team
  - 400: Bad request
  - 401: Unauthorized

- Body

   - code: 200 for success, 400 for failure
   - message: A message describing the result of the request
   - teamID: The id of the team
   - error: The error message if the request failed

### PUT

#### Description

Updates the information of a team, only an admin or the owner can update the team

Fields that can be updated:

- teamName
- Visibility
- teamImageID
- MIMEtype
- Score

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Body

    - teamID: The id of the team to update
    - teamName: The name of the team (Optional)
    - Visibility: The visibility of the team (Optional)
    - teamImageID: The id of the team's profile picture (Optional)
    - MIMEtype: The MIME type of the team's profile picture  (Optional, Required if teamImageID is provided)
    - Score: The score of the team (Optional)

#### Response

- Status Codes

  - 200: Successfully updated the team
  - 400: Bad request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Team not found

- Body

   - code: 200 for success, 400 for failure
   - message: A message describing the result of the request
   - error: The error message if the request failed

### DELETE

#### Description

Deletes a team, only an admin or the owner can delete the team

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Body

    - teamID: The id of the team to delete

#### Response

- Status Codes

  - 200: Successfully deleted the team
  - 400: Bad request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Team not found

- Body

   - code: 200 for success, 400 for failure
   - message: A message describing the result of the request
   - error: The error message if the request failed






