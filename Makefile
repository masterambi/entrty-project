start_client:
	PACKAGE=${package} vite --config ./config/builder/client.ts --mode development --host
start_server:
	PACKAGE=${package} tsup --config ./config/builder/server.ts --watch --onSuccess "npx nodemon dist/${package}/server/index.js"
start:
	PACKAGE=${package} concurrently "vite --config ./config/builder/client.ts --mode development --host" "tsup --config ./config/builder/server.ts --watch --onSuccess 'npx nodemon dist/${package}/server/index.js'"