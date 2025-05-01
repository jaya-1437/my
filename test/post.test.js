const request = require("supertest");
const app = require("../src/app");
 
describe("post Routes", () => {
  it("should create a new post", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "krish", content: "lord krishna biography", author: "jaya" });
 
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("title", "krish");
    expect(response.body.data).toHaveProperty("content", "lord krishna biography");
    expect(response.body.data).toHaveProperty("author", "jaya");
  });
 
  it("should not create a post without Title", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ content: "lord krishna biography", author: "jaya" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title, content, and author are required");
  });
 
  it("should not create a post without content", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "krish", author:"jaya" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title, content, and author are required");
  });
 
  it("should not create a post without author", async () => {
    const response = await request(app)
      .post("/posts")
      .send({ title: "krish", content: "lord krishna biography" });
 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title, content, and author are required");
  });
 
  it("should get all posts", async () => {
    const response = await request(app).get("/posts");
 
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
 
  it("should get a post by ID", async () => {
    const post = { title: "krish", content: "lord krishna biography", author: "jaya" };
    const createResponse = await request(app).post("/posts").send(post);
    const postId = createResponse.body.data.id;
 
    const response = await request(app).get(`/posts/${postId}`);
 
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", postId);
    expect(response.body.data).toHaveProperty("title", "krish");
  });
 
  it("should return 404 for a non-existent post ID", async () => {
    const response = await request(app).get("/posts/9999"); // Non-existent post ID
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
 
  it("should update a post by ID", async () => {
    const post = { title: "krish", content: "lord krishna biography", author: "jaya" };
    const createResponse = await request(app).post("/posts").send(post);
 
    const postId = createResponse.body.data.id;
    const updatedPost = {
      title: "Jane Doe",
      content: "jane@example.com",
      author: 32,
    };
 
    const response = await request(app)
      .put(`/posts/${postId}`)
      .send(updatedPost);
 
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("title", "Jane Doe");
    expect(response.body.data).toHaveProperty("content", "jane@example.com");
    expect(response.body.data).toHaveProperty("author", 32);
  });
 
  it("should return 404 when trying to update a non-existent post ID", async () => {
    const response = await request(app)
      .put("/posts/9999") // Non-existent post ID
      .send({ title: "Updated Title" });
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
 
  it("should delete a post by ID", async () => {
    const post = { title: "krish", content: "lord krishna biography", author: "jaya" };
    const createResponse = await request(app).post("/posts").send(post);
 
    const postId = createResponse.body.data.id;
    const deleteResponse = await request(app).delete(`/posts/${postId}`);
 
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Post deleted successfully");
  });
 
  it("should return 404 when trying to delete a non-existent post ID", async () => {
    const response = await request(app).delete("/posts/9999"); // Non-existent post ID
 
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
});