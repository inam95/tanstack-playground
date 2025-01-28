import { createPostComment, incrementPostViews } from "@/api/posts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { postsQueries } from "@/queries/posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/$postId")({
  component: Post,
  params: {
    parse: (params) => ({
      postId: z.number().int().parse(Number(params.postId)),
    }),
    stringify: (params) => ({
      postId: `${params.postId}`,
    }),
  },
});

function Post() {
  const { postId } = Route.useParams();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const {
    data: postDetail,
    isLoading,
    error,
  } = useQuery({
    ...postsQueries.details(postId),
  });

  const incrementViewsMutation = useMutation({
    mutationFn: incrementPostViews,
    onSuccess: () => {
      queryClient.invalidateQueries(postsQueries.details(postId));
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (newComment: string) => createPostComment(postId, newComment),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries(postsQueries.details(postId));
    },
  });

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCommentMutation.mutate(commentText);
  };

  if (isLoading) return <div className="p-2">Loading post...</div>;
  if (error) return <div className="p-2 text-red-500">Error loading post</div>;
  if (!postDetail) return <div className="p-2">No post found</div>;

  return (
    <div className="p-2 space-y-4">
      {/* Post Title & Views */}
      <div>
        <h1 className="text-xl font-semibold">{postDetail.title}</h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-gray-600">Views: {postDetail.views}</span>
          <Button
            onClick={() => incrementViewsMutation.mutate(postDetail.id)}
            className="px-2 py-1 rounded bg-blue-500 text-white"
          >
            +1 View
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div>
        <p>{postDetail.content}</p>
      </div>

      {/* Comments Section */}
      <hr />
      <div>
        <h2 className="text-lg font-bold mb-2">Comments</h2>

        {postDetail.comments && postDetail.comments.length > 0 ? (
          <ul className="space-y-2">
            {postDetail.comments.map((comment, idx) => (
              <li key={idx} className="border p-2 rounded">
                {comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add a New Comment */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border rounded p-2"
        />
        <Button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={addCommentMutation.isPending}
        >
          {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
        </Button>
      </form>
    </div>
  );
}
