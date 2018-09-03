install:
	npm install
start:
	npm run babel-node -- src/bin/hello.js
lint:
	npm run eslint src/**
publish:
	npm publish