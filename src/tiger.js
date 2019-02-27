const { getLogger } = require("log4js");

function Tiger(config) {
  this.config = config
  this.plugins = {}
  this.tigs = {}

  this.resolvers = {}
  this._state = {}

  this.logger = getLogger("tiger");
  this.logger.level = "INFO"
}

Tiger.prototype.use = function(plugin) {
  plugin(this)
}

Tiger.prototype.define = function(id, handler) {
  this.tigs[id] = handler

  const target = handler[0]
  const processor = handler[1]
  const targetDef = target.split(":");
  const protocol = targetDef[0]
  const path = targetDef[1]

  const resolver = this.resolvers[protocol]

  if (resolver && resolver.define) {
    resolver.define(path, id, processor, this);
  } else {
    this.logger.warn(`No valid definition handler found for protocol [${protocol}]`)
  }
}

Tiger.prototype.log = function(log, scope) {
  this.logger.info(`${scope ? scope + " -- " : ""}${log}`);
  return this;
}

Tiger.prototype.error = function(log, scope) {
  this.logger.error(`${scope ? scope + " -- " : ""}${log}`);
  return this;
}

Tiger.prototype.notify = function(target, param) {
  this.log(`Notifying target: ${target} with param ${param}`)

  const targetDef = target.split(":")
  const protocol = targetDef[0];
  const path = targetDef[1]

  const resolver = this.resolvers[protocol]

  if (resolver && resolver.notify) {
    resolver.notify(path, param, this)
  } else {
    this.logger.warn(`No valid notification handler found for protocol [${protocol}]`)
  }
}

Tiger.prototype.register = function(protocol, resolver) {
  this.resolvers[protocol] = resolver;
}

Tiger.prototype.state = function(key, value) {
  if (value) {
    this._state[key] = value
  } else {
    return this._state[key] || {}
  }
}

Tiger.prototype.serve = function() {
  
}

module.exports = Tiger