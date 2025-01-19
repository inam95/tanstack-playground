import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";

import { z } from "zod";
import { directionSchema, sortBySchema } from "../types";

const homeSearchSchema = z.object({
  sortBy: fallback(sortBySchema, "id").default("id"),
  order: fallback(directionSchema, "desc").default("desc"),
});

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: zodSearchValidator(homeSearchSchema),
  beforeLoad: async ({ context, search }) => {},
});

function HomeComponent() {
  const { order, sortBy } = Route.useSearch();

  return <div className="mx-auto max-w-3xl p-4">Hello</div>;
}
