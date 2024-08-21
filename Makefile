start_client:
	PACKAGE=${package} vite --config ./config/builder/client.ts --mode development --host
start_server:
	PACKAGE=${package} tsup --config ./config/builder/server.ts --watch --onSuccess "npx nodemon dist/${package}/server/index.js"
start:
	PACKAGE=${package} concurrently "vite --config ./config/builder/client.ts --mode development --host" "tsup --config ./config/builder/server.ts --watch --onSuccess 'npx nodemon dist/${package}/server/index.js'"

db_create:
	PACKAGE=${package} npx sequelize-cli db:create
db_drop:
	PACKAGE=${package} npx sequelize-cli db:drop

migration_init:
	PACKAGE=${package} npx sequelize-cli init:migrations
migration_create:
	PACKAGE=${package} npx sequelize-cli migration:create --name $(name)
migration_up:
	PACKAGE=${package} npx sequelize-cli db:migrate
migration_undo:
	PACKAGE=${package} npx sequelize-cli db:migrate:undo

seeder_create:
	PACKAGE=${package} npx sequelize-cli seed:create --name ${name} 
seeder_up_all:
	PACKAGE=${package} npx sequelize-cli db:seed:all
seeder_down_all:
	PACKAGE=${package} npx sequelize-cli db:seed:undo:all

create_mysql: 
	docker run -d --name mysql8 -p 6666:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8