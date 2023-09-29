const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

const { Server } = require("socket.io")
const setChatRoutes = require("./src/routes/chatRoutes")
const setUserRoutes = require("./src/routes/userRoutes")
const setStaticRoutes = require("./src/routes/staticRoutes")
const setSockets = require("./src/sockets")
const useGraphql = require("./src/graphql")

dotenv.config()

const app = express()
const server = http.createServer(app)
;(async () => {
	const io = new Server(server, {
		cors: {
			origin: "*", // TODO: Change this to the frontend URL
		},
	})

	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		authSource: "admin",
		user: process.env.MONGODB_USER,
		pass: process.env.MONGODB_PASSWORD,
	})

	app.use(cors())
	app.use(express.json())

	setChatRoutes(app)
	setUserRoutes(app)
	setStaticRoutes(app)

	await useGraphql(app)

	setSockets(io)

	const port = process.env.PORT || 3000

	server.listen(port, () => {
		console.log(`Server listening on port ${port}`)
	})
})()
