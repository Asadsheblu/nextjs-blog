import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

const CommentTable = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments/all');
      console.log('Fetched comments:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      toast.error('Failed to fetch comments.');
    }
  };

  const approveComment = async (id) => {
    try {
      console.log('Approving comment with ID:', id); // Log the ID being approved
      const response = await axios.put('/api/comments//all', { commentId: id, approved: true });
      console.log('Approve response:', response.data);  // Log response for debugging

      if (response.status === 200) {
        setComments(comments.map(comment => comment._id === id ? { ...comment, approved: true } : comment));
        toast.success('Comment approved successfully!');
      } else {
        console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Comment not found or already updated.');
      } else {
        console.error('Error approving comment:', error.message);
        toast.error('Failed to approve comment.');
      }
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await axios.delete('/api/comments/all', { data: { commentId: id } });
      console.log('Delete response:', response.data);  // Log response for debugging

      if (response.status === 200) {
        setComments(comments.filter((comment) => comment._id !== id));
        toast.success('Comment deleted successfully!');
      } else {
        console.log(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      toast.error('Failed to delete comment.');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4 text-center">All Comments</h2>
        <table className="min-w-full bg-white border shadow p-4">
          <thead>
            <tr className='bg-gray-200'>
              <th className="py-2 px-4 border-b">Author</th>
              <th className="py-2 px-4 border-b">Comment</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment._id}>
                <td className="py-2 px-4 border-b">{comment.author}</td>
                <td className="py-2 px-4 border-b">{comment.content}</td>
                <td className="py-2 px-4 border-b">
                  {!comment.approved && (
                    <button 
                      onClick={() => approveComment(comment._id)} 
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => deleteComment(comment._id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default CommentTable;
