# API Reference for User associated teams based endpoints


## Endpoint: /api/teams/memberof

### GET

#### Description

Get the information of all teams that the user is a member of

#### Request

- Headers

  - Authorization: Bearer <JWT Token>

#### Response

- code: <Status Code>
- data: An array of team objects
    
      - teamID: The id of the team
      - teamName: The name of the team
      - teamImageID: The id of the team image
      - MIMEtype: The MIME type of the team image
      - status: The status of the team
      - role: The role of the user in the team
      - Visibility: The visibility of the team

## Endpoint: /api/teams/owned

### GET

#### Description

Get the information of all teams that the user owns

#### Request

- Headers

  - Authorization: Bearer <JWT Token>

#### Response

- code: <Status Code>
- data: An array of team objects
    
      - teamID: The id of the team
      - teamName: The name of the team
      - teamImageID: The id of the team image
      - MIMEtype: The MIME type of the team image
      - status: The status of the team
      - role: The role of the user in the team
      - Visibility: The visibility of the team

## Endpoint: /api/teams/adminof

### GET

#### Description

Get the information of all teams that the user is an admin of

#### Request

- Headers

  - Authorization: Bearer <JWT Token>

#### Response

- code: <Status Code>
- data: An array of team objects
    
      - teamID: The id of the team
      - teamName: The name of the team
      - teamImageID: The id of the team image
      - MIMEtype: The MIME type of the team image
      - status: The status of the team
      - role: The role of the user in the team
      - Visibility: The visibility of the team
