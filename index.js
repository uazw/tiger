
const Tiger = require("./tiger")
const { http, zmq, cron } = require("./protocols")

module.exports = function(config) {
  const tiger = new Tiger(config || {});

  tiger.use(http)
  tiger.use(zmq)
  tiger.use(cron)

  return tiger;
}