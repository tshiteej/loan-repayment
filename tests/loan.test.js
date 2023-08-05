const request = require("supertest");
const app = "http://localhost:3000";

const loginData = {
  email: "johndoe@example.com",
  password: "testpassword",
  type: "MEMBER",
};

(async () => {
  await request(app).post("/auth/register").send(loginData);
})();
async function getAuthToken() {
  const response = await request(app).post("/auth").send(loginData).expect(200);
  //   console.log(response, "----RESPONSE----");
  return response.body.token;
}

// Test suite for /loan/request route
describe("POST /loan/request", () => {
  it("should return 401 when accessing without authentication", async () => {
    await request(app)
      .post("/loan/request")
      .send({
        amount: 1000,
        tenure: 12,
      })
      .expect("Content-Type", /json/)
      .expect(401);
  });

  it("should return 200 when accessing with authentication", async () => {
    // Get the authentication token
    const token = await getAuthToken();

    // Make the request with the authenticated token
    await request(app)
      .post("/loan/request")
      .set("x-auth-token", `${token}`)
      .send({
        amount: 1000,
        tenure: 12,
      })
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should return 400 for invalid loan request data", async () => {
    // Get the authentication token
    const token = await getAuthToken();

    // Make the request with the authenticated token and invalid data
    await request(app)
      .post("/loan/request")
      .set("x-auth-token", `${token}`)
      .send({
        amount: -1000, // Invalid negative amount
        tenure: 0, // Invalid zero tenure
      })
      .expect("Content-Type", /json/)
      .expect(400);
  });

  // Add more test cases for different scenarios, validation checks, etc.
});
