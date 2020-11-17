# Simple Nodejs server
This is a simple Node.js server using Express, JWT with sqlite3.

With the route middleware to authenticate and check token.
Send request with token in `session`, `body`, `param` or `header`:
- `req.session.token`
- `req.body.token`
- `req.param('token')`
- `req.headers['n-access-token']`

## Table contents
- [Requirements](#Requirements)
- [Install](#Install)
- [Run the Server](#Run)
- [Usages](#Usages)
    - [/login](#login)
    - [/me](#me)
    - [/people](#people)
    - [/logout](#logout)
    - [/logout](#logout)
- [Acknowledgements](#Acknowledgements)
- [Credits](#Credits)


<hr>

## Requirements
- Nodejs
- Dependencies: 
        ```"array-unique": "~0.3.2",
        "body-parser": "~1.18.3",
        "cookie-parser": "~1.4.4",
        "cors": "~2.8.5",
        "deepmerge": "~3.2.0",
        "express": "~4.16.4",
        "ejs": "2.5.6",
        "express-session": "^1.11.3",
        "helmet": "^3.6.1",
        "moment": "^2.18.1",
        "fs": "0.0.1-security",
        "jsonwebtoken": "^8.5.1",
        "latinize": "~0.4.0",
        "md5": "^2.2.1",
        "morgan": "~1.9.1",
        "node-cron": "~2.0.3",
        "pug": "~2.0.3",
        "sequelize": "^5.3.1",
        "serve-favicon": "~2.5.0",
        "sqlite3": "^4.0.8",
        "yargs": "~13.2.2",
        "path": "^0.12.7",
        "request": "^2.81.0",
        "underscore": "^1.8.3"```

## Install


```bash
npm i
```
## Run the Server

Start the server in bash

```bash
node index.js
```

## Usages

The server is running at http://localhost:4000/

Existing API:

### /login

Using POST with Content-Type: `x-wwww-form-urlencoded`
```
POST http://localhost:4000/api/login
Content-Type: x-wwww-form-urlencoded

username: nle
userpwd: 1234
```

or using GET:
```
GET
http://localhost:4000/api/login/nle/1234
```

Data retrieved:
```
{
    "message": "success",
    "token": "aaa.bbb.ccc",
    "data": {
        "id": 1,
        "isActive": 1,
        "useremail": "leqnam@live.com",
        "username": "nle",
        "firstname": "Le",
        "midname": "Quoc",
        "givenname": "Nam",
        "birthday": "",
        "gender": 1,
        "avatar": "avatar.jpg",
        "phone": "1080",
        "address": "Nha ko so - Pho ko ten",
        "gps": null,
        "created": "2019-05-02",
        "updated": "2019-05-31",
        "started": "2019-05-02",
        "ended": null,
        "dept_id": 1,
        "metadata": null,
        "deptName": "Developers"
    }
}
```

### /me
```
GET
http://localhost:4000/api/me
```
Data retrieved:
```
{
    "id": 1,
    "isActive": 1,
    "useremail": "leqnam@live.com",
    "username": "nle",
    "firstname": "Le",
    "midname": "Quoc",
    "givenname": "Nam",
    "birthday": "",
    "gender": 1,
    "avatar": "avatar.jpg",
    "phone": "1080",
    "address": "Nha ko so - Pho ko ten",
    "gps": null,
    "created": "2019-05-02",
    "updated": "2019-05-31",
    "started": "2019-05-02",
    "ended": null,
    "dept_id": 1,
    "metadata": null,
    "deptName": "Developers",
    "iat": 1589277908,
    "exp": 1589637908
}
```

### /people

```
GET
http://localhost:4000/api/people
```

### /logout

```
GET
http://localhost:4000/api/logout
```

## Acknowledgements

This repository is for teaching purpose at HUTECH in 2017.

## Credits

Contact me for futher information:
- Le Quoc Nam
- leqnam@live.com / nam@nready.net
- https://nready.net