

# Everkeep UI
[![Build](https://github.com/shveykinvlad/everkeep-api/actions/workflows/build.yml/badge.svg)](https://github.com/shveykinvlad/everkeep-api/actions/workflows/build.yml)
[![CodeQL](https://github.com/shveykinvlad/everkeep-api/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shveykinvlad/everkeep-api/actions/workflows/codeql-analysis.yml)

### Notes service  
Frontend: https://everkeep.herokuapp.com  
Backend: https://everkeep-api.herokuapp.com  
#### Technologies
* TypeScript
* Angular
* Material UI
* JWT
* Interceptors
* App routing
* Guards
#### Functionality
* REST
* Registration
* Authorization
* Authentication
* Reset/Update password
* Auth token
* Refresh token
* CRUD

## How to run locally
#### Prerequisites
* Locally running [everkeep-api](https://github.com/shveykinvlad/everkeep-api#how-to-run-locally) application;
#### Steps
1. open project folder: `cd <path-to-project>`;
2. set up environment variables in `.env` file;
3. run app in docker container: `docker-compose up`;
4. stop app docker container: `docker-compose down`;
