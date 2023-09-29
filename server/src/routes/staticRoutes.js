const express = require("express")
const path = require("path")

const uploadsPath = path.join(__dirname, "../../uploads")

const setStaticRoutes = (app) => {
	app.use("/uploads", express.static(uploadsPath))
}

module.exports = setStaticRoutes
