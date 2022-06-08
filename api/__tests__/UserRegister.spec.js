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

const validUser = {
  username: "user1",
  email: "user1@email.com",
  password: "P4ssw0rd",
};

const invalidUser = {
  username: null,
  email: "user1@email.com",
  password: "P4ssw0rd",
};

const postUser = (user) => {
  return request(app).post("/api/1.0/users").send(user);
};

describe("User Registration", () => {
  it("should return 200 OK when signup request is valid", async () => {
    const response = await postUser(validUser);
    expect(response.status).toBe(200);
  });

  it("should return success message when signup request is valid", async () => {
    const response = await postUser(validUser);
    expect(response.body.message).toBe("User created");
  });

  it("should save the user to database", async () => {
    await postUser(validUser);
    // query the user table
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it("should save the username and email to database", async () => {
    await postUser(validUser);
    // query the user table
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe("user1");
    expect(savedUser.email).toBe("user1@email.com");
  });

  it("should hashes the password in database", async () => {
    await postUser(validUser);
    // query the user table
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe("P4ssw0rd");
  });

  it("should return 400 when username is null", async () => {
    const response = await postUser(invalidUser);
    expect(response.status).toBe(400);
  });
});
