const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(PORT, err => {
  if (err) {
    console.log("I am in error of listen");
    throw err;
  }
  console.log(`listening on port 9090`);
});
