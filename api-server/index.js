'use strict'

const fastify = require('fastify')
const {name} = require('./package.json')
const nats_client = require('./lib/client/index.js')

const port = 3000

module.exports = {
  start
}

async function start() {
  const server = fastify({ logger: true })

  const client = await nats_client()

  server.get('/notif/message/:message_id', async function handler (request, reply) {
    const {params: message_id} = request
    console.log('received request for %s', message_id)

    const resp = await client.request('notif.get', {
      'message_id': message_id
    })

    console.log(resp)
    reply.code(200).send(resp)
  })

  await server.listen({
    port: port
  , host: '0.0.0.0'
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
