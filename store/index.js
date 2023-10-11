// create a connection
const nc = await connect({ servers: "demo.nats.io" });

// create a codec
const sc = StringCodec();

// this subscription listens for `time` requests and returns the current time
const subscription = nc.subscribe("time");
(async (sub) => {
  console.log(`listening for ${sub.getSubject()} requests...`);
  for await (const m of sub) {
    if (m.respond(sc.encode(new Date().toISOString()))) {
      console.info(`[time] handled #${sub.getProcessed()}`);
    } else {
      console.log(`[time] #${sub.getProcessed()} ignored - no reply subject`);
    }
  }
  console.log(`subscription ${sub.getSubject()} drained.`);
})(subscription);