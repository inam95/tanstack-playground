import { queryOptions } from "@tanstack/react-query";
import { fetchPostById, fetchPostComments, fetchPosts } from "../api/posts";
import { PostsSortCriteria } from "../types";

export const postsQueries = {
  all: () =>
    queryOptions({
      queryKey: ["posts"] as const,
    }),
  allList: () =>
    queryOptions({
      queryKey: [...postsQueries.all().queryKey, "list"],
    }),
  list: ({ direction, sortBy }: PostsSortCriteria) =>
    queryOptions({
      queryKey: [
        ...postsQueries.allList().queryKey,
        { direction, sortBy },
      ] as const,
      queryFn: () => fetchPosts(sortBy, direction),
    }),
  details: (postId: number) =>
    queryOptions({
      queryKey: ["post", postId] as const,
      queryFn: () => fetchPostById(postId),
    }),
  comments: (postId: number) =>
    queryOptions({
      queryKey: [...postsQueries.details(postId).queryKey, "comments"] as const,
      queryFn: () => fetchPostComments(postId),
    }),
};
