# GPA For Me (GPA Calculator)
This calculator will calculate your GPA in real time.  
You can change the GPA scale, add semesters and classes, save all data, and have both semester and cumulative GPA readily available.

### Check it out live [here](http://gpafor.me)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2c4eb1aa-51e6-4820-9871-378e9999c45f/deploy-status)](https://app.netlify.com/sites/gpaforme/deploys)

## Build Setup
``` bash
# install dependencies
$ npm install

# run faunaDB schema setup
$ npm run setup-db

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run generate
$ npm start
```

## Built with
- NuxtJS framework
- Auth0 serverless authentication
- FaunaDB serverless database
- Bootstrap 4 for CSS library
- Lots of :coffee: + :heart:

## Comments
I decided to use a serverless setup for this calculator.  
This website will be statically generated with NuxtJS and hosted with Netlify.  
It will use Auth0 as an authentication service for users.  
FaunaDB will be the serverless database used to store data.

## To Do List
- ~~Allow it to save inputs using cookies or local storage.~~  
- ~~Add more GPA Models like Highschool AP classes.~~  
- ~~Add semesters into calculations.~~  
- ~~Ability to rename semesters~~
- ~~Show credit count next to semesters.~~  
- ~~Add Login and Sign up to keep track of GPA progress~~.  
- ~~Connect to Database (faunadb)~~ 
- ~~Add images and favicon.~~  
- ~~Buy a custom domain and add a simple logo.~~  
- Allow users to input a custom GPA scale.  
- Add option to keep track of multiple schools.  
