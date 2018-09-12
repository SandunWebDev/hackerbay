
# Review

## Task 1

- [x] Pushed to Github - Created github repo and pushed code
- [x] Get Endpoint - Has a get endpoint that returns data sent via a post endpoint
- [x] Post Endpoint - Has a post endpoint that saves data on a global variable
- [x] Start script - Has start script for running app using npm or yarn
- [x] Healthy API - Root path is helthy with {success:true} on get.

```
POST localhost:3000/data
```

```javascript
BODY  
{
	"data":{
		"test":true
	}
}

RESPONSE 
{
	"data":{
		"test":true
	}
}
```

```
GET localhost:3000/data
```

```javascript
RESPONSE 
{
	"data":{
		"test":true
	}
}
```

## Notables

- App start with start script
- Used express.json - bodyparser was moved back to express
- Has integrated eslint
- Has root path handled- Healthy backend.
- Has api documented well.

## Issues Noted

- Bad code structure that may not work well with lengthy endpoints ie in app.get('/data',(req,res)=>{...}).post((req,res)=>{...})
- Logging.
- ERror repsonse on POST to roor path.

# Assessment 

Overall persformance is excellent. Keep up.


