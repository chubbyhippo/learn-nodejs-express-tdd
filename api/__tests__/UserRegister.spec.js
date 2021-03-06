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
    const response = await postUser({
      username: null,
      email: "user1@email.com",
      password: "P4ssw0rd",
    });
    expect(response.status).toBe(400);
  });

  it("should return validation errors field in response body when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: "user1@email.com",
      password: "P4ssw0rd",
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  it("should return email and username cannot be null when validation error occurs", async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: "P4ssw0rd",
    });
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(["username", "email"]);
  });

  const cases = [
    ["Username cannot be null.", "username"],
    ["Email cannot be null.", "email"],
    ["Password cannot be null.", "password"],
  ];

  it.each(cases)(
    "should return %s when null %s is received",
    async (expectedMessage, field) => {
      const user = {
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssw0rd",
      };
      user[field] = null;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );

  it.each`
    field         | value             | expectedMessage
    ${"username"} | ${null}           | ${"Username cannot be null."}
    ${"username"} | ${"usr"}          | ${"Must have min 4 and max 32 characters."}
    ${"username"} | ${"a".repeat(33)} | ${"Must have min 4 and max 32 characters."}
    ${"email"}    | ${null}           | ${"Email cannot be null."}
    ${"email"}    | ${"mail.com"}     | ${"Email is not valid."}
    ${"email"}    | ${"user@mail"}    | ${"Email is not valid."}
    ${"password"} | ${null}           | ${"Password cannot be null."}
    ${"password"} | ${"P4ssw"}        | ${"Password must be at least 6 characters."}
    ${"password"} | ${"lowercase"}    | ${"Password must contain at least 1 uppercase, 1 lowercase letter and 1 number."}
    ${"password"} | ${"UPPERCASE"}    | ${"Password must contain at least 1 uppercase, 1 lowercase letter and 1 number."}
    ${"password"} | ${"123456789"}    | ${"Password must contain at least 1 uppercase, 1 lowercase letter and 1 number."}
    ${"password"} | ${"UPPERlower"}   | ${"Password must contain at least 1 uppercase, 1 lowercase letter and 1 number."}
    ${"password"} | ${"UPPER1234"}    | ${"Password must contain at least 1 uppercase, 1 lowercase letter and 1 number."}
    ${"password"} | ${"lower1234"}    | ${"Password must contain at least 1 uppercase, 1 lowercase letter and 1 number."}
  `(
    "should return $expectedMessage when $field is $value",
    async ({ field, value, expectedMessage }) => {
      const user = {
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssw0rd",
      };
      user[field] = value;
      const response = await postUser(user);
      const body = response.body;
      expect(body.validationErrors[field]).toBe(expectedMessage);
    }
  );
});
