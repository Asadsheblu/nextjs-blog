import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const { db } = await connectToDatabase();
      const result = await db.collection('notice').updateOne(
        { page: 'notice' },
        { $set: { content } },
        { upsert: true }
      );

      if (result.upsertedId) {
        const insertedDocument = await db.collection('notice').findOne({ _id: result.upsertedId });
        res.status(201).json(insertedDocument);
      } else {
        const updatedDocument = await db.collection('notice').findOne({ page: 'notice' });
        res.status(200).json(updatedDocument);
      }
    } catch (error) {
      // console.error('Error updating or inserting document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('notice').findOne({ page: 'notice' });

      if (!result) {
        return res.status(200).json({ content: '' });
      }

      res.status(200).json(result);
    } catch (error) {
      // console.error('Error fetching document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}