
.PHONY: build
build:
	coffee -c -o lib src/server
	coffee -c -o public/js/lib src/client

.PHONY: publish
publish:
	docker build -t andersjanmyr/pinga .
	docker push andersjanmyr/pinga

.PHONY: run
run:
	docker run -it andersjanmyr/pinga --name pinga
