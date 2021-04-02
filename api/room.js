const { Router } = require("express");
const Course = require("../models/course");
const User = require("../models/user");
const Message = require("../models/message");
const router = Router();

router.post("/search", async (req, res, next) => {
	try {
		const query = req.body.query.toUpperCase()
		const rooms = await Course.find({ courseNameFull : { $regex: '.*' + query + '.*' }})
		if(rooms.length < 1) {
			return res.status(404).send("none")
		}
		res.send(rooms)
	} catch (error) {
		console.log(error.message);
		next(error);
	}
});

router.get("/:room", async (req, res, next) => {
	try {
		const room = await Course.findOne({ courseNameFull: req.params.room})
		if(!room) {
			return res.status(404).send("none")
		}
		const messages = await Message.find({ room : req.params.room }).sort('createdAt').populate('user')
		
		res.send(messages)
	} catch (error) {
		next(error);
	}
});

router.post("/:room", async (req, res, next) => {
	try {
		const room = await Course.findOne({ courseNameFull: req.params.room})
		if(!room) {
			return res.status(404).send("none")
		}
		const user = await User.findById("606211befeeb031aa417e2ed")
		const message = new Message({ text : req.body.text, room : req.params.room, user})
		message.save()
		res.send(message)
	} catch (error) {
		next(error);
	}
});

router.delete("/delete", async (req, res, next) => {
	try {
		await Message.deleteMany({})
		await User.deleteMany({})
		res.send(true)
	} catch (error) {
		next(error);
	}
});

module.exports = router;
