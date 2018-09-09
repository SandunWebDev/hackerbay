# Hackerbay Server Monitoring Project
In this repository, I am creating a Server Monitoring Software step by step from scratch.  Its workload spread throughout 20 Tasks and each task is in a separate branch. Once task is finished and code reviewed its merged with master. So final product is on master branch.

I am doing this with Open Source course materials from [HackerBay University. ](https://course.hackerbayuniversity.com/)

## How To Run
 - Clone the repository.
 - `cd` into the source directory.
 - Run `npm install` to install dependencies.
 - Then run `npm run dev`.
- Normally you can interact with program through http://localhost:3000
 - Individual guides for tasks can be found below.
		
NOTE : Make sure postgre server is already running. In dev mode, by default it connect to "hackerbay" database with username "devadmin". If needed change default values in "./configs/main.js" or pass specific env. varaiables. 


## How To Test
 - `npm test` - Run full test suite with coverage. (Unit + Integration)
-  `npm run test:unit` - Only run unit tests in watch mode.
-  `npm run test:inte` - Only run integration tests in watch mode.
-  `npm run test:all` - Run all tests in watch mode.

## Used Technologies & Main Packages
|FrontEnd|BackEnd|Tools|Other| 
|--|--|--|--|
| React  |NodeJS + Express  |ESLint + AirBnB + Prettier  | Postman |
|  | Postgres + Sequalize  | Mocha + Chai + Sinon + Istanbul + TravisCI + CodeCov ||
|  | Passport + BCryprt + JWT |  ||


## Tasks Summery ( Completed - 15%)
|Task No|Description|Status|Other| 
|--|--|--|--|
| [01](#task-01) | Creating Simple API | Finished |-|
| [02](#task-02) | Connecting To The Database | Finished |-|
| [03](#task-03) | Testing API | Code Review Pending |-|


## Each Task Breief Summery
### Task 01

|Path |Request Type |Request Body |Response Body |Description |
|--|--|--|--|--|
|http://localhost:3000/ |GET| -- | `{status:  "success"}`  | Root path. User get confirmation connection is succssful. |
|http://localhost:3000/data | GET | -- |  `{data: "ANYDATA"}` | Send user's stored data in server which we recived in "/data" POST request. |
|http://localhost:3000/data | POST | `{data: "ANYDATA"}` |  `{data: "ANYDATA"}` | Save data recived in body. These saved data can be accessed through "/data" GET request.  |


### Task 02

|Path |Request Type |Request Body |Response Body |Description |
|--|--|--|--|--|
|http://localhost:3000/user/signup |POST| `{email : "ANYEMAIL", password: "ANYPASSWORD"}` | `{status:  true | flase, token : "TOKEN", errMsg: "ERROR : DESC" }`  | User can create account providing email & password. If sucess return `{status: true, token: "TOKEN"}`. If any error occured return `{status: false, errMsg: "ERROR : DESC "}` |
|http://localhost:3000/data/user/login | GET | `{email : "ANYEMAIL", password: "VALIDPASSWORD"}` |  `{data: "ANYDATA"}` | User can login using already created user account details. If email exist and password match return `{status: true, token: "TOKEN"}`. If any error occured return `{status: false, errMsg: "ERROR : DESC "}` |

### Task 03

Added unit and integration test to following API paths.
  - /
  - /data
  - /user/signup
  - /user/login

