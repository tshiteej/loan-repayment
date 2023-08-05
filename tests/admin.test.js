const request = require("supertest");
const app = "http://localhost:3000";

const adminLoginData = {
  name: "Some Admin",
  email: "admin@exampe.com",
  password: "testpassword",
  type: "ADMIN",
};
const loginData = {
  email: "johndoe@example.com",
  password: "testpassword",
  type: "MEMBER",
};
let loanId = "";

(async () => {
  await request(app).post("/auth/register").send(adminLoginData);
})();
// Helper function to authenticate an admin user and get the token
async function getAdminAuthToken() {
  const response = await request(app)
    .post("/auth")
    .send(adminLoginData)
    .expect(200);

  return response.body.token;
}

async function getAuthToken() {
  const response = await request(app).post("/auth").send(loginData);

  return response.body.token;
}

(async () => {
  let token = await getAuthToken();
  console.log(token, "==TOKEN==");
  let data = await request(app)
    .post("/loan/request")
    .set("x-auth-token", `${token}`)
    .send({
      amount: 1000,
      tenure: 12,
    });
  console.log(data, "==data==");
  loanId = data.body.data.loanData._id;
})();
// Test suite for /admin/loan/status route
describe("PUT /admin/loan/status", () => {
  it("should return 401 when accessed without authentication", async () => {
    await request(app)
      .put("/admin/loan/status")
      .send({
        loanId: loanId,
        status: "APPROVED",
      })
      .expect("Content-Type", /json/)
      .expect(401);
  });

  it("should return 401 when accessed with non-admin authentication", async () => {
    // Get the authentication token for a regular user (non-admin)
    const userToken = await getAuthToken();

    // Make the request with the non-admin authentication token
    await request(app)
      .put("/admin/loan/status")
      .set("x-auth-token", `${userToken}`)
      .send({
        loanId: loanId,
        status: "APPROVED",
      })
      .expect("Content-Type", /json/)
      .expect(401);
  });

  it("should return 200 and update loan status when accessed by admin", async () => {
    // Get the authentication token for an admin user
    const adminToken = await getAdminAuthToken();
    const newStatus = "APPROVED";

    // Make the request with the admin authentication token and valid data
    const response = await request(app)
      .put("/admin/loan/status")
      .set("x-auth-token", `${adminToken}`)
      .send({
        loanId: loanId,
        status: newStatus,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    // Check if the response contains the updated loan status
    expect(response.body).toHaveProperty("data", true);
  });

  it("should return 400 for non-existing loan ID", async () => {
    // Get the authentication token for an admin user
    const adminToken = await getAdminAuthToken();

    // Mock a non-existing loan ID
    const newStatus = "APPROVED";

    // Make the request with the admin authentication token and non-existing loan ID
    await request(app)
      .put("/admin/loan/status")
      .set("x-auth-token", `${adminToken}`)
      .send({
        loanId: "non-existing-loan-id",
        status: newStatus,
      })
      .expect("Content-Type", /json/)
      .expect(400);
  });
});
