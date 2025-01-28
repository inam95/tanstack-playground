import { createFileRoute, Link } from "@tanstack/react-router";
import { fallback } from "@tanstack/zod-adapter";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { postsQueries } from "@/queries/posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowUpIcon } from "lucide-react";
import { z } from "zod";
import { directionSchema, SortBy, sortBySchema } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createPost } from "@/api/posts";

const homeSearchSchema = z.object({
  sortBy: fallback(sortBySchema, "id").default("id"),
  order: fallback(directionSchema, "desc").default("desc"),
});

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: homeSearchSchema,
});

function HomeComponent() {
  const { order, sortBy } = Route.useSearch();
  const navigate = Route.useNavigate();

  const queryClient = useQueryClient();
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    ...postsQueries.list({ direction: order, sortBy }),
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries(postsQueries.allList());
    },
  });
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
    onSubmit: ({ value }) => {
      createPostMutation.mutate({
        authorId: 1,
        content: value.content,
        title: value.title,
      });
    },
  });

  return (
    <div className="mx-auto max-w-3xl p-4 flex gap-8">
      <div className="w-1/2 space-y-4">
        <h2 className="text-xl font-semibold">Posts</h2>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(sortBy: SortBy) => {
              navigate({
                to: "/",
                search: (prev) => ({
                  ...prev,
                  sortBy,
                }),
              });
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="views">Views</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              navigate({
                to: "/",
                search: (prev) => ({
                  ...prev,
                  order: order === "desc" ? "asc" : "desc",
                }),
              });
            }}
          >
            <ArrowUpIcon
              className={cn("size-4 transition-transform duration-300", {
                "rotate-180": order === "desc",
              })}
            />
          </Button>
        </div>

        {/* Posts List */}
        {isLoading && <p>Loading posts...</p>}
        {error && <p>Error fetching posts.</p>}
        {posts?.length === 0 && <p>No posts found.</p>}
        {posts && (
          <ul className="space-y-3">
            {posts.map((post) => (
              <Link to="/$postId" params={{ postId: post.id }} key={post.id}>
                <li key={post.id} className="border p-3 rounded">
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Views: {post.views}
                  </p>
                  <p>{post.content}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Create New Post Form */}
      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.Field
            name="title"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: (value) => {
                if (value.value.length < 3) {
                  return "Title must be at least 3 characters long";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Input
                  type="text"
                  placeholder="Title"
                  className="border p-2 rounded"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          ></form.Field>
          <form.Field
            name="content"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: (value) => {
                if (value.value.length < 10) {
                  return "Content must be at least 10 characters long";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Textarea
                  placeholder="Content"
                  className="border p-2 rounded"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          ></form.Field>
          <form.Subscribe
            selector={(state) => state.errors}
            children={(errors) => {
              console.log(errors);
              if (errors.length > 0) {
                return (
                  <Alert variant="destructive">
                    <AlertTitle>
                      <AlertCircle className="text-red-500" />
                      Error
                    </AlertTitle>
                    <AlertDescription>{errors[0]}</AlertDescription>
                  </Alert>
                );
              }
            }}
          />
          <Button type="submit" className="self-start">
            Create Post
          </Button>
        </form>
      </div>
    </div>
  );
}
