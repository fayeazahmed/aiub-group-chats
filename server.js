const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const roomController = require("./api/room");
const userController = require("./api/user");
const bookmarkController = require("./api/bookmark");
const Message = require("./models/message")

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "*",
	},
});
app.use(cors());

mongoose.connect(
	process.env.MONGODB_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log("Connected to database")
);

io.on("connection", (socket) => {
	socket.on("join", room => {
		socket.room = room;
		socket.join(room)
	})

	socket.on("message", (data) => {
		const newMessage = new Message(data)
		newMessage.save()
		
		data["_id"] = newMessage._id
		data["createdAt"] = newMessage._id.getTimestamp().toString()
		io.sockets.in(data.room).emit("message", data)
	})

	socket.on("typing", (room) => socket.to(room).emit("typing"))

	socket.on("disconnect", () => {});
});

app.use("/rooms", roomController);
app.use("/users", userController);
app.use("/bookmarks", bookmarkController);

if(process.env.NODE_ENV == "production") {
	app.use(express.static("client/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}

app.use((error, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === "production" ? "cake" : error.stack,
	});
});

server.listen(process.env.PORT || 5000);

/* 
	WEB SCRAPING code to collect and add course names into database
  app.get("/", (req, res) => {
	request(
		"https://www.aiub.edu/faculties/fst/programs/under-graduate/bachelor-of-science-in-computer-science--engineering",
		(e, response, html) => {
			const $ = cheerio.load(html);
			const tables = $("#cse_curriculum #accordion tbody");
			tables.each((index, elem) => {
				const rows = $(elem).children("tr");
				rows.each((i, row) => {
					if (i !== rows.length - 1) {
						const courseNameFull = $(row).children("td").eq(1).text().trim();
						const course = new Course({ courseNameFull });
						course.save();
						console.log(course);
					}
				});
			});
		}
	);
	res.send("ok");
});

*/
