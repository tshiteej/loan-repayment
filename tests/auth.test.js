const request = require("supertest");
const app = "http://localhost:3000";

// Test suite for /auth/register route
describe("POST /auth/register", () => {
  it("should create a new member user and return 200", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "testpassword",
      type: "MEMBER",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(userData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });

  it("should create a new admin user and return 200", async () => {
    const adminUserData = {
      name: "Admin User",
      email: "admin@example.com",
      password: "testpassword",
      type: "ADMIN",
    };

    const response = await request(app)
      .post("/auth/register")
      .send(adminUserData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});

// Test suite for /auth route
describe("POST /auth", () => {
  it("should authenticate a user and return a token", async () => {
    const loginData = {
      email: "johndoe@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/auth")
      .send(loginData)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });

  it("should return 400 for invalid credentials", async () => {
    const invalidLoginData = {
      email: "johndoe@example.com",
      password: "wrongpassword",
    };

    await request(app)
      .post("/auth")
      .send(invalidLoginData)
      .expect("Content-Type", /json/)
      .expect(400);
  });

  // Add more test cases for edge cases, login attempts for non-existing users, etc.
});
