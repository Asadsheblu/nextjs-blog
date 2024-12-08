import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

const CommentTable = () => {
  const [comments, setComments] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments/all');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      toast.error('Failed to fetch comments.');
    }
  };

  const approveComment = async (id) => {
    try {
      const response = await axios.put('/api/comments/all', { commentId: id, approved: true });

      if (response.status === 200) {
        setComments(comments.map(comment => comment._id === id ? { ...comment, approved: true } : comment));
        toast.success('Comment approved successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('Comment not found or already updated.');
      } else {
        toast.error('Failed to approve comment.');
      }
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
  
    try {
      const response = await axios({
        method: 'delete',
        url: '/api/comments/all',
        data: { commentId: id } // `data` is needed to pass the `commentId`
      });
  
      console.log(response);
  
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment._id !== id));
        toast.success('Comment deleted successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment.');
    }
  };
  
  

  const handleEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditContent('');
  };

  const handleUpdateComment = async () => {
    try {
      const response = await axios.put('/api/comments/all', { commentId: editCommentId, content: editContent });

      if (response.status === 200) {
        setComments(comments.map(comment => comment._id === editCommentId ? { ...comment, content: editContent, edited: true } : comment));
        toast.success('Comment updated successfully!');
        handleCancelEdit();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update comment.');
    }
  };
  const renderCommentRow = (comment, isReply = false) => (
    <tr key={comment._id} className={isReply ? 'bg-gray-100' : ''}>
      <td className={`py-2 px-4 border-b ${isReply ? 'pl-8' : ''}`}>
        {comment.name} 
        {isReply ? (
          <span className="text-gray-500 text-xs ml-2">(replay)</span>
        ) : (
          <span className="text-gray-500 text-xs ml-2">(comment)</span>
        )}
        {!comment.approved && <span className="text-red-500 text-xs ml-2">(Pending)</span>}
        {comment.edited && <span className="text-blue-500 text-xs ml-2">(Edited)</span>}
      </td>
      <td className="py-2 px-4 border-b break-all">
        {editCommentId === comment._id ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        ) : (
          comment.content
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {editCommentId === comment._id ? (
          <div className="inline-flex space-x-2">
            <button
              onClick={handleUpdateComment}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
              Cancel
            </button>
          </div>
        ) : (
          <div className="inline-flex space-x-2">
            {!comment.approved && (
              <button 
                onClick={() => approveComment(comment._id)} 
                className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                Approve
              </button>
            )}
            <button 
              onClick={() => handleEdit(comment)} 
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Edit
            </button>
            <button 
              onClick={() => deleteComment(comment._id)} 
              className="bg-red-500 text-white px-2 py-1 rounded text-xs">
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
  

  const renderComments = (comments, isReply = false) => (
    <>
      {comments.map(comment => (
        <React.Fragment key={comment._id}>
          {renderCommentRow(comment, isReply)}
          {comment.replies && (
            <tr>
              <td colSpan="3">
                <table className="min-w-full">
                  <tbody>
                    {renderComments(comment.replies, true)}
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4 text-center">All Comments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border shadow p-4">
            <thead>
              <tr className='bg-gray-200'>
                <th className="py-2 px-4 border-b">Author</th>
                <th className="py-2 px-4 border-b">Comment</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderComments(comments)}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CommentTable;
