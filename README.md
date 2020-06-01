# GPA For Me (GPA Calculator)
This calculator will calculate your GPA in real time.  
You can change the GPA scale, add semesters and classes, save all data, and have both semester and cumulative GPA readily available.

### Check it out live [here](http://gpafor.me)

## Build Setup
``` bash
# install dependencies
$ npm install

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

## Comments
I decided to use a serverless setup for this calculator.  
This website will be statically generated with NuxtJS and hosted with Netlify.  
It will use Auth0 as an authentication service for users.  
FaunaDB will be the serverless database used to store data.

## To Do List
- ~~Allow it to save inputs using cookies or local storage.~~  
- ~~Add more GPA Models like Highschool AP classes.~~  
- ~~Add semesters into calculations.~~  
- Ability to rename semesters and maybe reorder them?  
- Show credit count next to semesters.  
- Allow users to input custom GPA scale.  
- Add Login and Sign up to keep track of GPA progress.  
- Connect to Database 
- Add a dashboard to see progress after the previous are implemented.  
- ~~Add images and favicon.~~  
- ~~Buy a custom domain and add a simple logo.~~  
