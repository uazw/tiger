# Plugin

Tiger bundled with few standard plugins:

  - `cron`: for scheduled tasks,
  - `http`: for http request listeners,
  - `zmq`: for using message queue communication between modules,
  - `mail`: for sending out email.

## Plugin details

### `cron`

Literally, `cron` is a plugin that allows module runs based on a cron expression. it only take effect when you define a module. It doesn't provide any messages but actually mutates the state.

#### Attributes

| Attributes    	| Value 	|
|---------------	|-------	|
| Stateless     	| N     	|
| Message       	| N     	|
| Messge Format 	| {}    	|
| `define`?     	| Y     	|
| `notify`?     	| N     	|

#### Example

**define**

```js
["cron:*/5 * * * * *", function (tiger, { count = 0 }) {
  count++;
  return { count }
}]
```

### `http`

`http` plugin allows you runs on a specific http path on Tiger server. `http` plugin is stateful and provide both a HTTP request and a response object as message to the module.

#### Attributes

| Attributes    	| Value           	|
|---------------	|-----------------	|
| Stateless     	| N               	|
| Message       	| Y               	|
| Messge Format 	| `{ req, res }`  	|
| `define`?     	| Y               	|
| `notify`?     	| N               	|

#### Example

**define**

```js
["http:hello", function (tiger, state, {req, res}) {
  res.send("hello world");
  return state;
}]
```


### `zmq`

`zmq` plugin creates a set of queues to communicate between modules.
You can either create a module follows a queue, or send messages to the queue in any module(with `Tiger#notify`).

#### Attributes

| Attributes    	| Value                           	|
|---------------	|---------------------------------	|
| Stateless     	| N                               	|
| Message       	| Y                               	|
| Messge Format 	| what you sent in `Tiger#notify` 	|
| `define`?     	| Y                               	|
| `notify`?     	| Y                               	|

#### Example

**define**

```js
["zmq:hello", function (tiger, state, message) {
  tiger.log(`Message received: ${JSON.stringify(message)}`)
}]
```

**notify**

```js

tiger.notify("zmq:hello", { message: "hello, world" })
```

### `mail`

`mail` plugin allow you send out email to any known address after configured a email transport.

Here is required configurations:

```js
{
  mail: {
    sender: "email@example.com",
    transport: {
      host: "some.smtp.server.com",
      port: 465,
      secure: true,
      auth: {
        user: "email@example.com",
        pass: "password"
      }
    }
  }
}
```

#### Attribute

| Attributes    	| Value                             	|
|---------------	|-----------------------------------	|
| Stateless     	| Y                                 	|
| Message       	| Y                                 	|
| Messge Format 	| { from, to, subject, text, html } 	|
| `define`?     	| N                                 	|
| `notify`?     	| Y                                 	|

#### Example

```js
// `from` and `to` can be omitted since it can be inferred from sender and target.
tiger.notify("mail:someone@another.com", { 
  subject: "hello", 
  text: "hello world", 
  html: "<p>hello world</p>" 
});
```

## Self-defined Plugins

### How plugin works

A plugin is just a function which takes tiger instance as argument and do some dirty work, including but not limited to register a new resolver.

```js
const somePlugin = function(tiger) {
  const resolver = {
    define(...) {
      // do definition work
    },

    notify(...) {
      // do notification work
    }
  },

  tiger.register("the-protocol", resolver)
}
```
