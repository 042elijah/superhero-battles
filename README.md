# Superhero Battles!
## What is it?
[Superhero Battles](http://superherobattlesfrontend.s3-website.us-east-2.amazonaws.com/) is a website that allows users to pit their favorite superheroes and supervillains from many different universes (Marvel, DC, and more!) against each other. 

Users can create and use their own custom heroes to battle against others to get to the top of the leaderboard. 

Superhero Battles uses the [Superhero API](https://superheroapi.com/).

## Using Superhero Battles
While Superhero Battles allows guests to access some parts of the website, like the [superhero wall](http://superherobattlesfrontend.s3-website.us-east-2.amazonaws.com/heroes), leaderboard, and the explore users page, it is best experienced with an account.

Simply register an account on the home page and you are ready to create your own custom hero and start battling other users. Navigate to the 'User Search' tab, select a user to battle, and either press '1v1 me!' to pit your custom hero against theirs or '3v3 me!' to bring some allies for your custom hero to battle alongside with. *Note you must have a custom hero to participate in battles.


## Tech Stack
Superhero Battles is a full stack web app build on Node.js, Express.js, React, and DynamoDB (NERD stack). Its frontend is hosted via an Amazon AWS S3 Bucket and its backend by an AWS EC2 instance.

## Running the Project
### Prerequisites
This project uses Node.js version v20.11.0. It uses packages like React, AWS SDK, Express, Jest, and more. They can be installed to the local fork by using `npm install` in the frontend and backend folders.

### Environment Variables
Superhero Battles uses the AWS SDK in order to communicate with the DynamoDB database. The AWS SDK requires the following environment variables: 

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION
```

Additionally, the Superhero API requires that you have an access token that can be generated on their website when signed in with a Facebook account. This token can be saved to an environment variable for use when making Superhero API calls.

### Starting the Server
Make sure to update the URL in `App.tsx` to match the desired IP address and port (use `localhost` for local development)

The backend can be started with 
```bash
cd backend ; npx nodemon src/app.js
```
or if NVM is not available
```bash
cd backend ; node src/app.js
```

The frontend can be started with
```
cd frontend ; npm start
```
