all:
help:
	echo "make all'
rm:
	rm -rf node_modules
build:
	rm -rf node_modules
	npm install
run:
	node index.js
