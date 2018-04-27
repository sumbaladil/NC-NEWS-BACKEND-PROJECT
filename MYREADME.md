## Northcoders News API

### Background

### URL

https://northcoders-news-1.herokuapp.com/

### Routes

```http
GET /api -- have to work on this
```

Serves an HTML page with documentation for all the available endpoints

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

Add a new comment to an article. This route requires a JSON body with a body & created_by key and value pair (created_by should be the valid user id)
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
