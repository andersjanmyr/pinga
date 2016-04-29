
.PHONY: build
build:
	coffee -c -o lib src/server
	coffee -c -o public/js/lib src/client
	lessc less/app.less public/css/app.css
	docker build -t andersjanmyr/pinga .


.PHONY: publish
publish:
	docker push andersjanmyr/pinga

.PHONY: run
run:
	docker run -it andersjanmyr/pinga --name pinga
