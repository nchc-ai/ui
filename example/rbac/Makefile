install_deps:
	glide install

build:
	rm -rf bin/*
	GOOS=linux go build -o bin/app ./cmd

run:
	rm -rf bin/*
	go build -o bin/app ./cmd
	./bin/app --OutCluster=true

clean:
	rm -rf bin/*

image:
	docker build -t ogre0403/in-cluster:cht .
