'use strict'

const {name} = require('./package.json')
const nats_client = require('./lib/client/index.js')

const port = 3000

// UUID -> state
const messages = new Map()

module.exports = {
  start
}

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

async function start() {
  const client = await nats_client()

  client.subscribe('notif.get', (payload) => {
    const {message_id} = payload

    if (messages.has(message_id)) {
      return messages.get(message_id)
    }

    return {
      message_id: message_id
    , err: "Not Found"
    }
  })

  client.subscribe('notif.publish', (payload) => {
    const {message} = payload

    // generate an Id
    const message_id = guidGenerator()
    const notification = {
      message_id: message_id
    , message: message
    , state: "QUEUED"
    , time: new Date().toISOString()
  }
    messages.set(message_id, notification)

    console.log('Processing new notification request: message_id: %s, notification: %s', message_id, notification)
    return notification
  })
}

// Properly teardown on INT and TERM signals.
process.on('SIGTERM', onSignal)
process.on('SIGINT', onSignal)

function onSignal(signal) {
  if (shutting_down) return
  shutting_down = true
  log.warn({signal}, 'received signal %s', signal)
  stop()
}

/* istanbul ignore next */
function onError(err) {
  console.error(err)
  process.nextTick(() => {
    throw err
  })
}

if (require.main === module) {
  start()
    .then(() => {
      console.log(`successfully started ${name}`, )
    })
    .catch(onError)
}
