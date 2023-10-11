'use stict'

const {connect} = require('nats')

const config = {
  name: "my-connection",
  servers: ['localhost:4222'],
};

module.exports = async () => {
  try {
    const nc = await connect(config);
    console.log(`connected to ${nc.getServer()}`);
    // this promise indicates the client closed
    const done = nc.closed();
    // do something with the connection

    // close the connection
    await nc.close();
    // check if the close was OK
    const err = await done;
    if (err) {
      console.log(`error closing:`, err);
    }
  } catch (err) {
    console.log(`error connecting to ${JSON.stringify(config)}`);
  } 
}
