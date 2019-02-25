# tiger-server

Tiger server is a very lightweight server for very simple process like webhooks.

## Usage

```
npm install tiger-server --save
```

and create `server.js`:
```

const tiger = require("tiger-server")()


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
```

Just run `node server.js` then you can now see these modules interactions.
