
FROM golang:1.19

WORKDIR /app

COPY go.mod ./

RUN go mod download

COPY *.go ./

RUN go build -o acceptor

EXPOSE 8080

CMD ["/acceptor"]
