const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

const { Server } = require("socket.io")
const setChatRoutes = require("./src/routes/chatRoutes")
const setSockets = require("./src/sockets")

dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server)

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

app.use(cors())
app.use(express.json())

setChatRoutes(app)
setSockets(io)

const port = process.env.PORT || 3000

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
