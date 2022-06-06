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

  it("should return success message when signup request is valid", (done) => {
    postValidUser().then((response) => {
      expect(response.body.message).toBe("User created");
      done();
    });
  });

  it("should save the user to database", (done) => {
    postValidUser().then(() => {
      // query the user table
      User.findAll().then((userList) => {
        expect(userList.length).toBe(1);
        done();
      });
    });
  });

  it("should save the username and email to database", (done) => {
    postValidUser().then(() => {
      // query the user table
      User.findAll().then((userList) => {
        const savedUser = userList[0];
        expect(savedUser.username).toBe("user1");
        expect(savedUser.email).toBe("user1@email.com");
        done();
      });
    });
  });

  it("should hashes the password in database", (done) => {
    postValidUser().then(() => {
      // query the user table
      User.findAll().then((userList) => {
        const savedUser = userList[0];
        expect(savedUser.password).not.toBe("P4ssw0rd");
        done();
      });
    });
  });
});
