install_deps:
	glide install

run-backend:
	rm -rf backend/bin/*
	go build -o backend/bin/app ./backend
	./backend/bin/app --OutCluster=true


run-frontend:
	npm  --prefix frontend start

clean:
	rm -rf backend/bin/*