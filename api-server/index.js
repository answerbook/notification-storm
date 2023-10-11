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

  // Declare a route
  server.get('/hello', function handler (request, reply) {
    reply.send({ hello: 'world' })
  })

  await server.listen({
    port: port
  , host: '0.0.0.0'
  })

  const client = await nats_client()

  client.subscribe('service:name', (m) => {
    return {
      user_id: '123'
    , name: 'John Doe'
    }
  })

  const res = await client.request(
    'service:name'
  , {user_id: '123'}
  )

  console.log(res)
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
