import { connectToDatabase } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query } = req;
  const { slug } = query;

  if (!slug && method !== 'PUT' && method !== 'DELETE') {
    return res.status(400).json({ message: 'Slug is required' });
  }

  let db, client;

  try {
    ({ db, client } = await connectToDatabase());
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection error', error: error.message });
  }

  const comments = db.collection('comments');

  switch (method) {
    case 'GET': {
      try {
        let result;

        if (slug === 'all') {
          result = await comments.find({}).toArray();
        } else {
          result = await comments.find({ slug, approved: true }).toArray();
        }

        if (!result.length) {
          console.log('No comments found');
          return res.status(404).json({ message: 'No comments found' });
        }

        const nestComments = (comments) => {
          const commentMap = {};
          comments.forEach((comment) => {
            comment.replies = [];
            commentMap[comment._id] = comment;
          });
          comments.forEach((comment) => {
            if (comment.parentId && commentMap[comment.parentId]) {
              commentMap[comment.parentId].replies.push(comment);
            }
          });
          return comments.filter((comment) => !comment.parentId);
        };

        res.status(200).json(nestComments(result));
      } catch (error) {
        console.error('GET error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }
      break;
    }

    case 'POST': {
      const { content, parentId, name, email } = req.body;

      if (!content || !name || !email) {
        return res.status(400).json({ message: 'Content, name, and email are required' });
      }

      const author = req.user?.username || 'Anonymous';
      const authorProfile = req.user?.profileImage || null;

      const comment = {
        slug,
        content,
        parentId: parentId ? new ObjectId(parentId) : null,
        author,
        authorProfile,
        name,
        email,
        createdAt: new Date(),
        approved: false, // New comments need admin approval
      };

      try {
        const result = await comments.insertOne(comment);

        if (!result.insertedId) {
          return res.status(500).json({ message: 'Failed to create comment' });
        }

        res.status(201).json({ message: 'Comment created successfully', comment });
      } catch (error) {
        console.error('POST error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }
      break;
    }

    case 'PUT': {
      const { commentId, approved } = req.body;
      console.log('Received commentId for approval:', commentId); // Log the received commentId
      console.log('Received approval status:', approved); // Log the approval status
      if (!commentId || typeof approved !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input' });
      }

      try {
        const result = await comments.updateOne(
          { _id: new ObjectId(commentId) },
          { $set: { approved } }
        );

        console.log('Update result:', result);  // Log the result for debugging

        if (result.modifiedCount === 0) {
          console.log(`Comment with ID ${commentId} not found or already updated`);
          return res.status(404).json({ message: 'Comment not found or already updated' });
        }

        res.status(200).json({ message: 'Comment updated' });
      } catch (error) {
        console.error('PUT error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }
      break;
    }

    case 'DELETE': {
      const { commentId } = req.body;
      console.log('Received commentId for deletion:', commentId); // Log the received commentId

      if (!commentId) {
        return res.status(400).json({ message: 'Invalid input' });
      }

      try {
        const result = await comments.deleteOne({ _id: new ObjectId(commentId) });

        if (result.deletedCount === 0) {
          console.log(`Comment with ID ${commentId} not found`);
          return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted' });
      } catch (error) {
        console.error('DELETE error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
