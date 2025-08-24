import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { commentAPI } from "../../services/commentAPI";
import { likeAPI } from "../../services/likeAPI";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";

const CommentsSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async (resetPage = false) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;

      const response = await commentAPI.getVideoComments(videoId, {
        page: currentPage,
        limit: 10,
      });

      const newComments = response.data.data?.docs || [];

      if (resetPage) {
        setComments(newComments);
        setPage(2);
      } else {
        setComments((prev) => [...prev, ...newComments]);
        setPage((prev) => prev + 1);
      }

      setHasMore(response.data.data?.hasNextPage || false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await commentAPI.addComment(videoId, newComment.trim());
      setComments((prev) => [response.data.data, ...prev]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const response = await commentAPI.updateComment(
        commentId,
        editContent.trim()
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? response.data.data : comment
        )
      );
      setEditingComment(null);
      setEditContent("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await commentAPI.deleteComment(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    try {
      await likeAPI.toggleCommentLike(commentId);
      // Refresh comments to get updated like counts
      fetchComments(true);
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast.error("Failed to update like");
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <ChatBubbleOvalLeftIcon className="w-6 h-6 mr-2" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitComment}
          className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex space-x-3">
            <img
              src={user.avatar}
              alt={user.fullName || user.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex space-x-3">
                <img
                  src={comment.owner?.avatar}
                  alt={comment.owner?.fullName || comment.owner?.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.owner?.fullName || comment.owner?.username}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {user && user._id === comment.owner?._id && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingComment === comment._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}

                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 mt-3">
                    <button
                      onClick={() => handleToggleCommentLike(comment._id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <HeartIcon className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Comments */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchComments(false)}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Comments"}
          </button>
        </div>
      )}

      {/* No Comments */}
      {comments.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
