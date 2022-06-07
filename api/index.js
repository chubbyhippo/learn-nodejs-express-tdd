const app = require("./src/app");
const sequelize = require("./src/config/database").default;

sequelize.sync();
app.listen(8080, () => console.log("app is running"));
