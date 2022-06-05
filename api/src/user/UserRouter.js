const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./User");
const router = express.Router();

router.post("/api/1.0/users", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = { ...req.body, password: hashed };
  await User.create(user);
  return res.send({ message: "User created" });
});

module.exports = router;
