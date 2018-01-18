var hooks = require('async_hooks')
var events = require('events')

module.exports = onListening

function onListening (onlistening) {
  var e = new events.EventEmitter()

  var hook = hooks.createHook({
    init (asyncId, type, triggerAsyncId, resource) {
      if (type === 'PIPESERVERWRAP' || type === 'TCPSERVERWRAP') {
        process.nextTick(function () {
          resource.owner.once('listening', function () {
            e.emit('listening', resource.owner.address())
          })
        })
      }
    }
  })

  hook.enable()
  e.destroy = () => hook.disable()

  if (onlistening) e.on('listening', onlistening)

  return e
}
