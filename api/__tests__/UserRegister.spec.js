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
  it("should return 200 OK when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssw0rd",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  it("should return success message when signup request is valid", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssw0rd",
      })
      .then((response) => {
        expect(response.body.message).toBe("User created");
        done();
      });
  });

  it("should save the user to database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssw0rd",
      })
      .then(() => {
        // query the user table
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });

  it("should save the username and email to database", (done) => {
    request(app)
      .post("/api/1.0/users")
      .send({
        username: "user1",
        email: "user1@email.com",
        password: "P4ssw0rd",
      })
      .then(() => {
        // query the user table
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe("user1");
          expect(savedUser.email).toBe("user1@email.com");
          done();
        });
      });
  });
});
