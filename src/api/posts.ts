import { BASE_URL } from "../constants";
import { Post } from "../types";

export const fetchPosts = async (
  order: "id" | "views" = "id",
  direction: "asc" | "desc" = "desc"
): Promise<Post[]> => {
  const searchParams = new URLSearchParams({ order, direction });
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
  newPost: Omit<Post, "id" | "views">
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
