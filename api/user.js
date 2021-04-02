const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/:id", async (req, res, next) => {
	const id = req.params.id
	try {
		let user = await User.findOne({username: id})
		if(!user) {
            user = new User({username: id})
            user.save()
		}
        res.send(user)
	} catch (error) {
		next(error);
	}
});

router.post("/:id", async (req, res, next) => {
	const id = req.params.id
	const username = req.body.username
	try {
		let user = await User.findById(id)
		if(!user) return res.status(404).send("User not found")
		if(user.username === username) return res.send(user)
		let alreadyExistedUser = await User.findOne({username})
		if(alreadyExistedUser) return res.status(406).send("Username already exists")
		
		user.username = username
		user.save()
        res.send(user)
	} catch (error) {
		next(error);
	}
});

module.exports = router;
