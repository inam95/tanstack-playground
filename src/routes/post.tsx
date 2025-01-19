import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/post")({
  component: Post,
});

function Post() {
  return <div className="p-2">Hello from Post</div>;
}
