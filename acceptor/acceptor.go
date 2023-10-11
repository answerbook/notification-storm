package main

import (
	"fmt"
	"net/http"
	"os"

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
		url = "nats://localhost:4222"
	}

	nc, _ := nats.Connect(url)

	fmt.Printf("CONNECTION: %v\n", nc)

	defer nc.Drain()

	nc.Publish("notif.send.email", []byte("hello"))
	nc.Publish("notif.send.slack", []byte("hello"))
	nc.Publish("notif.send.sms", []byte("hello"))
}

func main() {

	http.HandleFunc("/accept", accept)
	http.HandleFunc("/transform", transform)
	http.HandleFunc("/publish", publish)

	http.ListenAndServe(":8080", nil)
}
