'use strict'

// const transforms = require('./transforms/index.js')
const nats_connect = require('../nats/index.js')

module.exports = async () => {
	await nats_connect()
}