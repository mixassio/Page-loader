install:
	npm install
start:
	npm run babel-node -- src/bin/page-loader.js
lint:
	npx eslint .
publish:
	npm publish
test:
	npm test
test-debug:
	DEBUG=page-loader:* npm test
watch:
	npm run watch
.PHONY: test