install:
	npm install
start:
	npm run babel-node -- src/bin/page-loader.js
lint:
	npm run eslint src/**
publish:
	npm publish
test:
	npm test