'use stict'

const {connect} = require('nats')

const config = {servers: ['nats:4222']}

module.exports = async () => {
  try {
    const nc = await connect(config)
    console.log(`connected to ${nc.getServer()}`)

    return nc

  } catch (err) {
    console.log(`error connecting to ${JSON.stringify(config)}`)
  } 
}
