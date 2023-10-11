package main

import (
	"fmt"
	"net/http"
)

func accept(w http.ResponseWriter, req *http.Request) {

	fmt.Fprintf(w, "accept\n")
}

func transform(w http.ResponseWriter, req *http.Request) {

	fmt.Fprintf(w, "transform some stuff\n")
}

func publish(w http.ResponseWriter, req *http.Request) {

	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Fprintf(w, "%v: %v\n", name, h)
		}
	}
}

func main() {

	http.HandleFunc("/accept", accept)
	http.HandleFunc("/transform", transform)
	http.HandleFunc("/publish", publish)

	http.ListenAndServe(":8080", nil)
}
