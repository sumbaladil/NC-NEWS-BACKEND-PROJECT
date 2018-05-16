## Northcoders News API

This is Northcorders News API which uses MongoDB for its backend.

It has four collections of users, topics, articles and comments.

Each article belongs to a topic, referenced by a topic's \_id property.
Each article also have a random number of comments.
Each comment is created by a random user (referenced by their \_id property) and also belongs to a specific article (referenced by its \_id property too).
Users can add/ delete comments on any article using article id and vote up and down for the article.
Similarly user can vote up and down for any comment.

I have also built a functioning API at https://northcoders-news-1.herokuapp.com/

### Getting Started

#### Cloning repo from Github

Fork this repo from https://github.com/sumbaladil/BE-FT-northcoders-news to you github account.

Once forked copy the link from the green `Clone or Download` button.

Make a folder e.g News and through terminal cd into it , cd into BE-FT-northcoders-news, then git clone and paste the link.

```
cd News
cd BE-FT-northcoders-news
git clone (add the link you copied from repo)
```

Also run command:

```
code .
```

in terminal, this should open this folder in VS code

#### Adding Config settings

Once this folder is opened in VS code, make a folder `config` on same level as models & controllers etc.

Then make files index.js, development.js and test.js.

Following code needs to be added above files

##### index.js

Add follwing code in index.js file

```
const path = process.env.NODE_ENV || "development";

module.exports = require(`./${path}`);
```

##### development.js

Add follwing code in index.js file

```
module.exports = {
DB: "mongodb://localhost:27017/northcoders_news"
};
```

##### test.js

Add follwing code in test.js file

```
module.exports = {
DB: "mongodb://localhost:27017/northcoders_news_test"
};
```

### Installing

In integrated terminal run following commands to install dependencies:

```
npm install
```

run following command to install dev dependencies

```
npm install -D
```

### Running MongoDB Server

In seperate terminal, run following command to run MongoDB server:

```
mongod
```

### Seeding

For development run following command to seed develpment data in MongoDB

```
npm run seed:dev
```

### Running the tests

All the tests for this project is in spec/index.spec.js.
Tests will be using test data from seed/testData as this is small set of data and is for testing pupose only.
This data is seeded before each test and after performing all the test, the database disconnects.

Run following command to see the results of all the tests.

```
npm test
```

Note: If you want to run a specific test write `.only` after describe in the test case like this:

```
describe.only("api/topic...)
```

### Running App

1: run following command in integrated terminal. It should show you connection message.

```
npm run dev
```

2: If you want to see all endpoints working, use POSTMAN and use `localhost:9090/api` and check its functionality.
3: You can check my functioning API at https://northcoders-news-1.herokuapp.com.

### Routes

```http
GET /api
```

A page with documentation for all the available endpoints

```http
GET /api/topics
```

Get all the topics

```http
GET /api/topics/:topic_id/articles
```

Return all the articles for a certain topic

```http
POST /api/topics/:topic_id/articles
```

Add a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: {
"title": "this is my new article title"
"body": "This is my new article content"
"created_by": "5ae1fe7d9c0fde0813a6dabb"
}

```http
GET /api/articles
```

Returns all the articles

```http
GET /api/articles/:article_id
```

Get an individual article

```http
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

```http
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a body & created_by key and value pair (created_by should be a valid user id)
e.g: {"body": "This is my new comment",
"created_by":"5ae309fef1ad7b2cf6a3afc7"}
This should also increment the comment counter of that article

```http
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: /api/articles/:article_id?vote=up OR /api/articles/:article_id?vote=down
This will return that article back with updated vote count

```http
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: /api/comments/:comment_id?vote=up OR /api/comments/:comment_id?vote=down
This will return that comment back with updated vote count

```http
GET /api/comments/:comment_id
```

Get comment with comment id

```http
DELETE /api/comments/:comment_id
```

Deletes a comment with specific id and returns a json object of deleted comment. if you try to get deleted comment it should give message of 'Comment does not exist'

```http
GET /api/users
```

Returns a JSON object with all users.

```http
GET /api/users/:username
```

Returns a JSON object with the profile data for the specified user.

### Deployment

This project has been deployed on [Heroku](https://www.heroku.com)
Its development data has been taken from [Mlab](https://mlab.com) which was seeded by me before project got in production environment.

### Built With

* [Restful APIs]()
* [node.js framework](https://nodejs.org)
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Express server](https://www.npmjs.com/package/express)
* [MongoDB]()
* [mongoose package](https://www.npmjs.com/package/mongooses)

### Author & Developer

Sumbal Adil

### Acknowledgments

[Northcoders](https://northcoders.com) has given me the knowledge & support to make this project.
