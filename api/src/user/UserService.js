const bcrypt = require("bcrypt");
const User = require("./User");
const save = async (body) => {
  const hashed = await bcrypt.hash(body.password, 10);
  const user = { ...body, password: hashed };
  await User.create(user);
};
module.exports = { save };
