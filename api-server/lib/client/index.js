'use strict'

const {StringCodec} = require('nats')
const nats_connect = require('../nats/index.js')

module.exports = async () => {
  const ns = await nats_connect()

  return new Client(ns)
}

class Client {
  constructor(ns) {
    this.ns = ns
  }

  async request(topic_name, payload = {}) {
    const sc = StringCodec()
    const m = await this.ns.request(
      topic_name
    , sc.encode(JSON.stringify(payload))
    , { timeout: 1000 }
    )

    return JSON.parse(sc.decode(m.data))
  }

  send() {

  }

  async subscribe(topic_name, handler) {
    const sc = StringCodec()

    const subscription = this.ns.subscribe(topic_name)
    for await (const m of subscription) {
      const payload = JSON.parse(sc.decode(m.data))
      const response = await handler(payload)

      if (m.respond(sc.encode(JSON.stringify(response)))) {
        console.log(`[${topic_name}] handled #${subscription.getProcessed()}`)
      } else {
        console.log(`[${topic_name}] #${subscription.getProcessed()} ignored - no reply subject`)
      }
    }
  }
}