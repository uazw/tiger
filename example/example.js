
const tiger = require("../src/index")()


tiger.load("hello", ["zmq:hello", function (tiger, state, message) {
  tiger.log(`Message received: ${JSON.stringify(message)}`)
}])


tiger.load("cron", ["cron:*/5 * * * * *", function (tiger, { count = 0 }) {
  count++;
  tiger.notify("zmq:hello", { count })
  return { count }
}]);

tiger.load("request", ["http:/hello", function (tiger, state, { req, res }) {
  tiger.notify("zmq:hello", { message: "request recieved" });

  res.send("success!")
}])

tiger.serve();