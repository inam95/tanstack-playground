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
  console.log(req.query);
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

app.post("/api/posts", (req, res) => {
  const { title, content, authorId } = req.body;
  if (!title || !content || !authorId) {
    return res
      .status(400)
      .json({ error: "title, content, and authorId are required" });
  }

  // Generate a unique ID (here using Date.now(), but you could do something else)
  const newPost = {
    id: Date.now(),
    title,
    content,
    authorId,
    views: 0, // default to 0
  };

  db.posts.push(newPost);

  // Optionally, link post ID to the user if you want to maintain that relationship
  const user = db.users.find((u) => u.id === authorId);
  if (user) {
    user.posts.push(newPost.id);
  }

  res.status(201).json(newPost);
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

app.post("/api/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = db.posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ error: "comment is required" });
  }

  post.comments = post.comments || [];
  post.comments.push(comment);

  res.status(201).json(comment);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
