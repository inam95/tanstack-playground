// db.js (in-memory database)
export const db = {
  users: [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      posts: [1, 2],
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      posts: [3],
    },
  ],
  posts: [
    {
      id: 1,
      title: "First Post",
      content: "Lorem ipsum dolor sit amet...",
      authorId: 1,
      views: 28,
      comments: ["Great post!", "I really enjoyed this one."],
    },
    {
      id: 2,
      title: "Second Post",
      content: "Consectetur adipiscing elit...",
      authorId: 1,
      views: 102,
      comments: ["Very informative."],
    },
    {
      id: 3,
      title: "Another Post",
      content: "Ut enim ad minim veniam...",
      authorId: 2,
      views: 45,
      comments: ["This post helped me a lot!"],
    },
  ],
};
