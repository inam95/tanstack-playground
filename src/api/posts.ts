import { BASE_URL } from "../constants";
import { Direction, Post, SortBy } from "../types";

export const fetchPosts = async (
  sortBy: SortBy = "id",
  direction: Direction = "desc"
): Promise<Post[]> => {
  const searchParams = new URLSearchParams({ sortBy, direction });
  const response = await fetch(
    `${BASE_URL}/api/posts?${searchParams.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
};

export const fetchPostById = async (postId: number): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/api/posts/${postId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch the post");
  }
  return response.json();
};

export const incrementPostViews = async (postId: number): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/api/posts/${postId}/views`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to increment views");
  }
  return response.json();
};

export const createPost = async (
  newPost: Omit<Post, "id" | "views" | "comments">
): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  if (!response.ok) {
    throw new Error("Failed to create a new post");
  }
  return response.json();
};

export const fetchPostComments = async (postId: number): Promise<string[]> => {
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json() as Promise<string[]>;
};

export const createPostComment = async (
  postId: number,
  comment: string
): Promise<string> => {
  const response = await fetch(
    `http://localhost:3000/api/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create a new comment");
  }
  return response.json();
};
