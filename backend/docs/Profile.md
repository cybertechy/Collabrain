# API reference for profile endpoints

## Endpoint: /api/profile/

### GET

#### Description

Get profile information of current user

#### Request

- Headers

    - Authorization: Bearer *token*

#### Response

    - fname: first name of user
    - lname: last name of user
    - email: email of user
    - teams: list of teams user is a member of
    - friends: list of friends user has
    - blocked: list of users user has blocked
    - language: language user has set
    - uid: user id of user
    - contentStrikes: number of content strikes user has
    - 2FA: whether user has 2FA enabled (boolean)
    - TTS: whether user has Text-To-Speech enabled (boolean)
    - theme: theme user has set
    - colorBlindFilter: whether user has color blind filter enabled (boolean)
    - fontSize: font size user has set


### PUT

#### Description

Modify profile information of current user

#### Request

- Headers

    - Authorization: Bearer *token*

- Body

    - Properties listed in response can be modified Ex: fname, lname, email, language, theme, colorBlindFilter, fontSize, TTS, twoFA

Exception:

- To modify 2FA, write as `twoFA` instead of `2FA`
- Cannot modify `contentStrikes`

#### Response

    - fname: first name of user
    - lname: last name of user
    - email: email of user
    - teams: list of teams user is a member of
    - friends: list of friends user has
    - blocked: list of users user has blocked
    - language: language user has set
    - uid: user id of user
    - contentStrikes: number of content strikes user has
    - 2FA: whether user has 2FA enabled (boolean)
    - TTS: whether user has Text-To-Speech enabled (boolean)
    - theme: theme user has set
    - colorBlindFilter: whether user has color blind filter enabled (boolean)
    - fontSize: font size user has set

### DELETE

#### Description

Delete current user

#### Request

- Headers

    - Authorization: Bearer *token*

#### Response

- message: "User deleted"

