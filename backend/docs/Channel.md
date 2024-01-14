# API Reference for Channel based endpoints

## Endpoint: /api/teams/channel

### GET

#### Description

Get the information of a channel in a team

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Query Parameters

    - teamID: The id of the team
    - channelID: The id of the channel

#### Response

- code: <Status Code>
- data: A channel object

    - channelID: The id of the channel
    - channelName: The name of the channel
    - teamID: The id of the team
    - message: Array of message Objects  (Under construction)

### POST

#### Description

Create a channel in a team

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Body
    
        - teamID: The id of the team
        - channelName: The name of the channel

#### Response

- code: <Status Code>
- channelID: The id of the channel
- message: The message of the response

### PUT

#### Description

Update the information of a channel in a team, Updates only the channel name

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Body
    
        - teamID: The id of the team
        - channelName: The name of the channel
        - channelID: The id of the channel

#### Response

- code: <Status Code>
- message: The message of the response
- error: The error message if any

### DELETE

#### Description

Delete a channel in a team

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Body
    
        - teamID: The id of the team
        - channelID: The id of the channel

#### Response

- code: <Status Code>
- message: The message of the response
- error: The error message if any




