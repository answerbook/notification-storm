package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/nats-io/nats.go"
)

func accept(w http.ResponseWriter, req *http.Request) {

	fmt.Fprintf(w, "accept\n")
}

func transform(w http.ResponseWriter, req *http.Request) {

	fmt.Fprintf(w, "transform some stuff\n")
}

func publish(w http.ResponseWriter, req *http.Request) {
	url := os.Getenv("NATS_URL")
	if url == "" {
		url = "nats://localhost:14222"
	}

	nc, _ := nats.Connect(url)

	fmt.Printf("CONNECTION: %v\n", nc)

	defer nc.Drain()

	nc.Publish("greet.joe", []byte("hello"))

	sub, _ := nc.SubscribeSync("greet.*")

	msg, _ := sub.NextMsg(10 * time.Millisecond)
	fmt.Println("subscribed after a publish...")
	fmt.Printf("msg is nil? %v\n", msg == nil)

	nc.Publish("greet.joe", []byte("hello"))
	nc.Publish("greet.pam", []byte("hello"))

	msg, _ = sub.NextMsg(10 * time.Millisecond)
	fmt.Printf("msg data: %q on subject %q\n", string(msg.Data), msg.Subject)

	msg, _ = sub.NextMsg(10 * time.Millisecond)
	fmt.Printf("msg data: %q on subject %q\n", string(msg.Data), msg.Subject)

	nc.Publish("greet.bob", []byte("hello"))

	msg, _ = sub.NextMsg(10 * time.Millisecond)
	fmt.Printf("msg data: %q on subject %q\n", string(msg.Data), msg.Subject)
}

func main() {

	http.HandleFunc("/accept", accept)
	http.HandleFunc("/transform", transform)
	http.HandleFunc("/publish", publish)

	http.ListenAndServe(":8080", nil)
}
