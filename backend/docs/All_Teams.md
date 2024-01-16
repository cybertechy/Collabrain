# # API Reference for All teams based endpoints


## Endpoint: /api/teams/

### GET

#### Description

Get the information of all teams

#### Request

- Headers

    - Authorization: Bearer <JWT Token>

- Query Parameters

    - index: The index of the first team to be returned
    - noOfTeams: The number of teams to be returned (Note: This may not be equal to the number of teams returned as it returns only public teams)
    - sort: true or false (true: Sort the teams based on the Score of the team)

#### Response

- code: <Status Code>
- data: Collection of team object that contains the following fields

    - teamName: The name of the team
    - teamImageID: The id of the team image
    - MIMEtype: The MIME type of the team image
    - teamID: The id of the team
    - Score: The score of the team