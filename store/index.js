'use strict'

const {name} = require('./package.json')
const nats_client = require('./lib/client/index.js')

const port = 3000

module.exports = {
  start
}

async function start() {
  const client = await nats_client()

  client.subscribe('notif.get', (payload) => {
    const {params: message_id} = payload

    return {
      message_id: message_id
    , state: "QUEUED"
    , time: new Date().toISOString()
    }
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
