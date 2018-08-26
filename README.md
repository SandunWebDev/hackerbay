# Hackerbay Server Monitoring Project
In this repository, I am creating a Server Monitoring Software step by step from scratch.  Its workload spread throughout 20 Tasks and each task is in a separate branch. Once task is finished and code reviewed its merged with master. So final product is on master branch.

I am doing this with Open Source course materials from [HackerBay University. ](https://course.hackerbayuniversity.com/)

## How To Run
 - Clone the repository.
 - `cd` into the source directory.
 - run `npm install` to install dependencies.
 - run `npm start` to start the program.
 - Normally you can interact with program through http://localhost:3000
 - Individual guides for tasks can be found below.

## Used Technologies & Packages
|FrontEnd|BackEnd|Tools|Other| 
|--|--|--|--|
| React  |NodeJS + Express  |ESLint + AirBnB + Prettier  ||
|  |  |  ||

## Tasks Summery ( Completed - 0%)
|Task No|Description|Status|Other| 
|--|--|--|--|
| [01](#task-01) | Creating Simple API | Finished |-|
| [02](#task-02) | Connecting To The Database | WIP |-|

## Each Task Details
### Task 01
 - http://localhost:3000/ - 
	 - GET Request 
	 - Return `{status:  "success"}`
	 
 - http://localhost:3000/data
	 - POST Request
	 - Required send some data in the format of `{data: "ANYDATA"}`
	 - Return recived data. `{data: "ANYDATA"}`

 - http://localhost:3000/data
	 - GET Request
	 - Return recived data in above POST request. `{data: "ANYDATA"}`



