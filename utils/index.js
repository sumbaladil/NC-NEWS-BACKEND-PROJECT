const faker = require("faker");
const { random } = require("lodash");
exports.createIdReferenceObject = (data, docs) => {
  return data.reduce((acc, item, i) => {
    acc[item.slug || item.username || item.title] = docs[i]._id;
    return acc;
  }, {});
};

function getRandomUserId(userids) {
  const keysArray = Object.keys(userids);

  return userids[keysArray[random(0, keysArray.length - 1)]]; // a random user mongo id
}

function getUserId(userids) {
  const keysArray = Object.keys(userids);
  return userids[keysArray[0]]; // first user mongo id
}

exports.formatArticlesData = (articlesData, topicIds, userIds) => {
  return articlesData.map(article => {
    const { title, body, topic } = article;

    return {
      title,
      body,
      belongs_to: topicIds[article.topic],
      created_by:
        process.env.NODE_ENV === "test"
          ? getUserId(userIds)
          : getRandomUserId(userIds),
      vote: 0,
      comments: random(1, 3)
    };
  });
};

exports.formatCommentsData = (articlesData, userIds, articleIds) => {
  //In 'development' environment for every article we have random number of comments
  //const numberofComments = random(1, 3);
  return articlesData.reduce((acc, article) => {
    for (let i = 0; i < article.comments; i++) {
      const obj = {
        body: faker.lorem.sentences(),
        belongs_to: article._id,
        created_by:
          process.env.NODE_ENV === "test"
            ? getUserId(userIds)
            : getRandomUserId(userIds),
        votes: 0,
        created_at: new Date().toLocaleString()
      };

      acc.push(obj);
    }
    return acc;
  }, []);
};

exports.formatCommentsDataTest = (articlesData, userIds, articleIds) => {
  //In 'test' environment for every article have only comments

  return articlesData.reduce((acc, article) => {
    let obj = {
      body: "I am a test comment",
      belongs_to: article._id,
      created_by:
        process.env.NODE_ENV === "test"
          ? getUserId(userIds)
          : getRandomUserId(userIds),
      votes: 0,
      created_at: new Date().toLocaleString()
    };
    acc.push(obj);
    return acc;
  }, []);
};
