# AntiFome-Back

_Backend of the AntiFome app_

This app is made using Nodejs, Express, Sequelize, Postgres

## Getting started
To run this app follow these instruction:

1. Install `docker` and run `docker compose up` in order to deploy `Postgres`
2. Install `node.js` and `npm`
3. Run `npm start`
4. Install postman or another HTTP client
5. Make requests for this app `http://localhost`

## Available routes
Check them all out on the files into the routes and its controllers for more information
```json
/account GET
/cities GET
/donations GET, POST
/donations/all GET
/donations/waiting_donations GET
/ GET
/institutions GET
/login POST
/register POST
/packages GET, POST, DELETE
/packages/receive POST
/packages/content GET, DELETE
/packages/institution GET
/packages/content/institution GET
```

## Repositories
* [AntiFome Frontend](https://github.com/nickolasrm/AntiFome-Front)

* [AntiFome](https://github.com/nickolasrm/AntiFome)