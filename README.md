[![Build Status](https://travis-ci.com/SandunWebDev/hackerbay.svg?branch=master)](https://travis-ci.com/SandunWebDev/hackerbay)
[![codecov](https://codecov.io/gh/SandunWebDev/hackerbay/branch/master/graph/badge.svg)](https://codecov.io/gh/SandunWebDev/hackerbay)

# Hackerbay Server Monitoring Project - BackEnd
Backend part of the Server Monitoring Project. Frontend part can be found on [Hackerbay - FrontEnd.](https://github.com/SandunWebDev/hackerbay-frontend/)

## How To Run
 - Clone the repository.
 - `cd` into the source directory.
 - Run `npm install` to install dependencies.
 - Then run `npm start`.
 - Normally you can interact with program through http://localhost:4000
		
NOTE : Make sure postgre server is already running. In dev mode, by default it connect to "hackerbay" database with username "devadmin". If needed change default values in "./configs/main.js" or pass specific env. varaiables. 

## How To Test
 - `npm test` - Run full test suite with coverage. (Unit + Integration)
-  `npm run test:unit` - Only run unit tests in watch mode.
-  `npm run test:integration` - Only run integration tests in watch mode.
-  `npm run test:all` - Run all tests in watch mode.

## Used Technologies & Main Packages
|FrontEnd|BackEnd|Tools|Other| 
|--|--|--|--|
| See [Hackerbay - Frontend](https://github.com/SandunWebDev/hackerbay-frontend/)  |NodeJS + Express  |ESLint + AirBnB + Prettier  | Postman |
|  | Postgres + Sequalize  | Mocha + Chai + Sinon + Istanbul | TravisCI + CodeCov |
|  | Passport + BCryprt + JWT |  ||


## API Summery

|Path |Request Type |Request Body |Response Body |Description |
|--|--|--|--|--|
|http://localhost:3000/ |GET| -- | `{status:  "success"}`  | Root path. User get confirmation connection is succssful. |
|||||
|http://localhost:3000/data | GET | -- |  `{data: "SAVED_DATA"}` | Send user's stored data in server which we recived in "/data" POST request. |
|http://localhost:3000/data | POST | `{data: "ANY_STRING"}` |  `{data: "SAVED_DATA"}` | Save data recived in body. These saved data can be accessed through "/data" GET request.  |
||||||
|http://localhost:3000/user/login | GET | `{email : "VALID_EMAIL", password: "VALID_PASSWORD"}` | `{sucess:  true | flase, token : "TOKEN", errMsg: "ERROR : DESC" }` | User can login using already created user account details. If email exist and password match return `{sucess: true, token: "TOKEN"}`. If any error occured return `{sucess: false, errMsg: "ERROR : "ERROR"}` |
|http://localhost:3000/user/signup |POST| `{email : "ANY_EMAIL", password: "ANY_PASSWORD"}` | `{sucess:  true | flase, token : "TOKEN", errMsg: "ERROR : DESC" }`  | User can create account providing email & password. If sucess return `{sucess: true, token: "TOKEN"}`. If any error occured return `{sucess: false, errMsg: "ERROR : DESC "}` |

