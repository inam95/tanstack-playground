import { z } from "zod";

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  views: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  posts: number[];
};

export const sortBySchema = z.enum(["id", "views"]);
export const directionSchema = z.enum(["asc", "desc"]);

export type SortBy = z.infer<typeof sortBySchema>;
export type Direction = z.infer<typeof directionSchema>;

export type PostsSortCriteria = {
  sortBy: SortBy;
  direction: Direction;
};
