# Chatroom App

This is a chatroom application built with Node.js, Express, MongoDB, Socket.io, Vue.js, and Vite.

## Mongo and Redis

The project includes MongoDB and Redis as Docker containers for development purposes. **If you want to use these, you'll need to have Docker and Docker compose installed on your machine.**

## Server

The server is built with Node.js and Express. It uses MongoDB as the database and Socket.io for real-time communication. It also uses Redis as a cache system.


## Client

The client is built with Vue.js (using Typescript) and Vite.

## Development

To run the application on a local environment, follow these steps:

1. If you don't have Mongo nor Redis on your local machine, run `docker compose up` or  `docker compose up -d` if you want a dettached container
2. Install the dependencies for the server: `cd server && yarn install`
3. Run `cp .env.example .env` to create a copy of the env file for the server and adjust the settings in this file according to your environment.
4. Install the dependencies for the client: `cd ../client && yarn install`
5. Run `cp .env.example .env` to create a copy of the env file for the client and adjust the settings in this file according to your environment.
6. Start the server on a terminal: `cd ../server && yarn dev`
7. On another terminal start the client: `cd ../client && yar dev`

**Happy coding!**
