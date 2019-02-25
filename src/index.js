
const Tiger = require("./tiger")
const { http, zmq, cron } = require("./protocols")

module.exports = function() {
  const tiger = new Tiger();

  tiger.use(http)
  tiger.use(zmq)
  tiger.use(cron)

  return tiger;
}