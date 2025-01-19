import { queryOptions } from "@tanstack/react-query";
import { fetchUsers } from "../api/users";

export const userQueries = {
  all: () =>
    queryOptions({
      queryKey: ["users"] as const,
    }),
  list: () =>
    queryOptions({
      queryKey: [...userQueries.all().queryKey, "list"],
      queryFn: fetchUsers,
    }),
};
