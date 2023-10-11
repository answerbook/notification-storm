use futures::StreamExt;
use std::{env, str::from_utf8};

#[tokio::main]
async fn main() -> Result<(), async_nats::Error> {
    // Use the NATS_URL env variable if defined, otherwise fallback
    // to the default.
    let nats_url = env::var("NATS_URL")
        .unwrap_or_else(|_| "nats://localhost:4222".to_string());

    let client = async_nats::connect(nats_url).await?;


    let mut subscription =
        client.subscribe("notif.send.*".to_string()).await?;

    // Notice that the first message received is `greet.sue` and not
    // `greet.joe` which was the first message published. This is because
    // core NATS provides at-most-once quality of service (QoS). Subscribers
    // must be connected showing *interest* in a subject for the server to
    // relay the message to the client.
    loop {
        while let Some(message) = subscription.next().await {
            println!(
                "{:?} received on {:?}",
                from_utf8(&message.payload),
                &message.subject
            );
        }
    }


    Ok(())
}