import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReplyModal = ({ isOpen, onClose, onSubmit, parentId }) => {
  const [replyContent, setReplyContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen]);

  const generateCaptcha = () => {
    const randomCaptcha = Math.random().toString(36).substring(2, 8);
    setCaptcha(randomCaptcha);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      setCaptchaError('Captcha does not match');
      return;
    }

    onSubmit({ content: replyContent, name, email, parentId });
    setReplyContent('');
    setName('');
    setEmail('');
    setCaptchaInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Reply to Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            rows="3"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            required
          />
          <div className="mb-4">
            <label htmlFor="captcha" className="block mb-2 font-bold text-gray-700">Captcha</label>
            <div
              className="mb-2 p-2 bg-gray-200 text-center text-xl font-bold rounded-md relative"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                letterSpacing: '2px',
                background: 'url("/path/to/your/background-image.png")', // Use a background image for added complexity
                backgroundSize: 'cover',
                position: 'relative',
                display: 'inline-block',
                transform: 'rotate(-5deg)', // Slight rotation for obfuscation
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  color: 'transparent',
                  textShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Add shadow for noise
                  backgroundClip: 'text',
                  webkitBackgroundClip: 'text',
                }}
              >
                {captcha}
              </span>
            </div>
            <input
              type="text"
              id="captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter captcha"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              required
            />
            {captchaError && <p className="text-red-500">{captchaError}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-white bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Submit Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Comment = ({ comment, slug, onReply }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const handleReplySubmit = async ({ content, name, email, parentId }) => {
    try {
      const response = await axios.post(`/api/comments/${slug}`, {
        content,
        name,
        email,
        parentId,
      });
      onReply(response.data.comment);
      setIsReplyModalOpen(false);
      toast.info('Waiting for admin approval');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply.');
    }
  };

  return (
    <div className={`mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm ${comment.approved ? '' : 'opacity-50'} max-w-full`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full">
          {comment.authorProfile ? (
            <img src={comment.authorProfile} alt={comment.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <div className="p-3 bg-gray-100 rounded-lg max-w-full">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800 break-words">{comment.name}</p>
              <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
            <p className="mb-2 text-gray-700 break-words comment-content">{comment.content}</p>
          </div>
          <button
            onClick={() => setIsReplyModalOpen(true)}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Reply
          </button>
          <ReplyModal
            isOpen={isReplyModalOpen}
            onClose={() => setIsReplyModalOpen(false)}
            onSubmit={handleReplySubmit}
            parentId={comment._id}
          />
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-8 mt-4">
              {comment.replies.map((reply) => (
                <Comment key={reply._id} comment={reply} slug={slug} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Comments = ({ slug }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchComments();
    }
    generateCaptcha();
  }, [slug]);

  const generateCaptcha = () => {
    const randomCaptcha = Math.random().toString(36).substring(2, 8);
    setCaptcha(randomCaptcha);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/${slug}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (captchaInput !== captcha) {
      setCaptchaError('Captcha does not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/comments/${slug}`, {
        content: newComment,
        email,
        name,
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
      setEmail('');
      setName('');
      setCaptchaInput('');
      toast.info('Waiting for admin approval');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (reply) => {
    const updateComments = (comments) => {
      return comments.map((comment) => {
        if (comment._id === reply.parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        } else if (comment.replies) {
          return {
            ...comment,
            replies: updateComments(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(updateComments(comments));
  };

  return (
    <div className="w-full max-w-full pt-4 pb-4">
      <ToastContainer />
      <div className='border bg-white shadow-sm p-5 mb-5'>
        <h2 className="text-3xl font-bold mb-6">Leave Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full md:w-1/2 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full md:w-1/2 me-2 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
          <div className="mb-4">
            <label htmlFor="captcha" className="block text-gray-700 font-bold mb-2">Captcha</label>
            <div
              className="mb-2 p-2 bg-gray-200 text-center text-xl font-bold rounded-md relative"
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                letterSpacing: '2px',
                background: 'url("/path/to/your/background-image.png")', // Use a background image for added complexity
                backgroundSize: 'cover',
                position: 'relative',
                display: 'inline-block',
                transform: 'rotate(-3deg)', // Slight rotation for obfuscation
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  color: 'transparent',
                  textShadow: '0 0 3px rgba(0, 0, 0, 0.3)', // Reduced blur effect
                  backgroundClip: 'text',
                  webkitBackgroundClip: 'text',
                }}
              >
                {captcha}
              </span>
            </div>
            <input
              type="text"
              id="captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter captcha"
              className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            {captchaError && <p className="text-red-500">{captchaError}</p>}
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
     
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-full">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} slug={slug} onReply={handleReply} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
