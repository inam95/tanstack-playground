import { BASE_URL } from "../constants";
import { User } from "../types";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/api/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
