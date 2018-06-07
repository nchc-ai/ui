install_deps:
	glide install

run-backend:
	rm -rf bin/*
	go build -o bin/app ./backend
	./bin/app --OutCluster=true


clean:
	rm -rf bin/*