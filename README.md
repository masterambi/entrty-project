# Cafenerd

This entry project is just for learning techstacks and code patterns purpose.

# Prerequisites

- Node.js v20
- MySQL v8
- Docker (Optional)
- Any browser

# Preparation

1. Clone the repo into your environment
2. Run `cp config/env/cafenerd/.template.env config/env/cafenerd/.env`
3. Run `make create_mysql` (Optional)
4. Run `make create_redis` (Optional)
5. Run `npm install`
6. Run `make db_create package=cafenerd`
7. Run `make migration_up package=cafenerd`
8. run `make seeder_up_all package=cafenerd`

# How to Run

# Server

```
npm run start:server package=cafenerd
```

# Client

```
npm run start:client package=cafenerd
```

# Both Server and Client (Preferred)

Please refresh the page if you got an error when running the project for the first time

```
npm run start package=cafenerd
```

# Manual Testing

I haven't implemented the sign up feature yet, so you need to use these credentials to log in:

```
email: customer@mail.com
password: Pass12345

email: admin@mail.com
password: Pass12345
```
