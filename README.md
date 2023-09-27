# Chatroom App

This is a chatroom application built with Node.js, Express, MongoDB, Socket.io, Vue.js, and Vite.

## Server

The server is built with Node.js and Express. It uses MongoDB as the database and Socket.io for real-time communication. The server has the following features:

- Authentication: users can sign up, log in, and log out.
- Chat: users can create, view, and delete chat rooms and messages.
- User management: users can view and delete their own accounts.

## Client

The client is built with Vue.js and Vite. It uses Vuex for state management and Vue Router for routing. The client has the following features:

- Authentication: users can sign up, log in, and log out.
- Chat: users can view and send messages in chat rooms.
- User management: users can view and delete their own accounts.

## Getting Started

To run the application, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/chatroom-app.git`
2. Install the dependencies for the server: `cd chatroom-app/server && npm install`
3. Install the dependencies for the client: `cd ../client && npm install`
4. Start the server: `cd ../server && npm start`
5. Start the client: `cd ../client && npm run dev`
6. Open the application in your browser: `http://localhost:3000`

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Create a new pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.