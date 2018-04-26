const app = require("./app");

//const { PORT = 3000 } = process.env;

app.listen(9090, err => {
  if (err) throw err;
  console.log(`listening on port 9090`);
});
