const { Router } = require("express");
const Course = require("../models/course");
const User = require("../models/user");
const Bookmark = require("../models/bookmark");
const router = Router();

router.get("/:id", async (req, res, next) => {
	const id = req.params.id
    try {
		const user = await User.findById(id)
		if(!user) return res.status(404).send("User not found")
        const bookmarks = await Bookmark.find({ user}).populate("room")
        res.send(bookmarks)
	} catch (error) {
		next(error);
	}
});

router.post("/:id", async (req, res, next) => {
	const id = req.params.id
	const roomName = req.body.room
	try {
		let user = await User.findById(id)
		if(!user) return res.status(404).send("User not found")
		
        const room = await Course.findOne({ courseNameFull: roomName})
        if(!room) return res.status(404).send("none")

		let bookmark = await Bookmark.findOne({ user, room })
		if(bookmark) return res.send(bookmark)
        bookmark = new Bookmark({ user, room })
        bookmark.save()
        res.send(bookmark)
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", async (req, res, next) => {
	const id = req.params.id
	const roomName = req.body.room
	try {
		let user = await User.findById(id)
		if(!user) return res.status(404).send("User not found")

        const room = await Course.findOne({ courseNameFull: roomName})
        if(!room) return res.status(404).send("none")
		const bookmark = await Bookmark.findOneAndDelete({ user, room })
        res.send(bookmark)
	} catch (error) {
		next(error);
	}
});

module.exports = router;
