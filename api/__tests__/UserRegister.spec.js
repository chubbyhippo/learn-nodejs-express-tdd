const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/User");
const sequelize = require("../src/config/database").default;

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe("User Registration", () => {
  const postValidUser = () => {
    return request(app).post("/api/1.0/users").send({
      username: "user1",
      email: "user1@email.com",
      password: "P4ssw0rd",
    });
  };
  it("should return 200 OK when signup request is valid", async () => {
    const response = await postValidUser();
    expect(response.status).toBe(200);
  });

  it("should return success message when signup request is valid", async () => {
    const response = await postValidUser();
    expect(response.body.message).toBe("User created");
  });

  it("should save the user to database", async () => {
    await postValidUser();
    // query the user table
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("should save the username and email to database", async () => {
    await postValidUser();
    // query the user table
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@email.com");
  });

  it("should hashes the password in database", async () => {
    await postValidUser();
    // query the user table
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("P4ssw0rd");
  });

  it("should return 400 when username is null", async () => {
    const response = await request(app).post("/api/1.0/users").send({
      username: null,
      email: "user12@mail.com",
      password: "P4ssw0rd",
    });
    expect(response.status).toBe(400);
  });
});
