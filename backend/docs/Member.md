# API Reference for Member based endpoints

## Endpoint: /api/teams/members

### GET

#### Description

Get the information of all member of a team

#### Request

- Headers
    
    - Authorization: Bearer <JWT Token>

- Query Parameters

    - teamID: The id of the team

#### Response

- Code: <Status Code>

- Date

    - members: An array of member objects

        - fname: The first name of the member
        - lname: The last name of the member
        - email: The email of the member
        - role: The role of the member
        - status: The status of the member


## Endpoint: /api/teams/member

### POST

#### Description

Add a member to a team

#### Request

- Headers 
    - Authorization: Bearer <JWT Token>

- Body

    - teamID: The id of the team
    - memberID: The id of the member
    - fname: The first name of the member
    - lname: The last name of the member
    - email: The email of the member
    - role: The role of the member

#### Response

- Code: <Status Code>
- Message: <Message>
- Error: <Error>

### PUT

#### Description

Update the information of a member, Can update only the role / status of the member

#### Request

- Headers
    - Authorization: Bearer <JWT Token>

- Body
    - teamID: The id of the team
    - memberID: The id of the member
    - role: The role of the member (optional)
    - status: The status of the member (optional)

#### Response

- Code: <Status Code>
- Message: <Message>
- Error: <Error>

### DELETE

#### Description

Remove a member from a team

#### Request

- Headers
    - Authorization: Bearer <JWT Token>

- Body
    - teamID: The id of the team
    - memberID: The id of the member

#### Response

- Code: <Status Code>
- Message: <Message>
- Error: <Error>




