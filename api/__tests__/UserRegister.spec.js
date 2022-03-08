const request = require("supertest");
const app = require("../app");

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
