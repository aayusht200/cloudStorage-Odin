function createSignupPayload() {
  const id = crypto.randomUUID();

  return {
    email: `test-${id}@example.com`,
    firstName: "Test",
    lastName: "User",
    password: "TestPassword123!",
  };
}
export default createSignupPayload;
