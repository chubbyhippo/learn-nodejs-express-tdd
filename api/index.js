const app = require("./src/app");
const sequelize = require("./src/config/database").default;

sequelize.sync();
console.log("env: " + process.env.NODE_ENV);
app.listen(8080, () => console.log("app is running"));
