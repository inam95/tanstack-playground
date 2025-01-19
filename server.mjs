import express from "express";
import cors from "cors";
import { db } from "./db.mjs";

const PORT = 3000;

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/users", (req, res) => {
  res.json(db.users);
});

app.get("/api/posts", (req, res) => {
  const { sortBy = "id", direction = "desc" } = req.query;

  let sortedPosts = [...db.posts];

  sortedPosts.sort((a, b) => {
    const compareA = a[sortBy];
    const compareB = b[sortBy];

    if (compareA < compareB) {
      return direction === "asc" ? -1 : 1;
    }
    if (compareA > compareB) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  res.json(sortedPosts);
});

app.get("/api/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = db.posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

app.patch("/api/posts/:id/views", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = db.posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  post.views += 1;
  res.json(post);
});

app.get("/api/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = db.posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post.comments || []);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
