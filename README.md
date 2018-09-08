# tiger-server

Tiger server is a very lightweight server for very simple process like webhooks.

## Usage

```
npm install tiger-server --save
```

and create `server.js`:
```
let { tiger } = require("trigger-server")

let tg = tiger();

tg.serve(`${__dirname}/modules`);
```

`modules/hello.js`:
```
module.exports = {
    method: "get",
    state: {},
    handler: (req, res) => {
        res.send("hello world");
    } 
}
```

Just run `node server.js` then you can now visit your module via https://localhost:9527/modules/hello.js