import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  const { method } = req;

  const { db } = await connectToDatabase();
  const collection = db.collection('categories');

  switch (method) {
    case 'GET':
      try {
        const categories = await collection.find({}).toArray();
        res.status(200).json(categories);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const { name } = req.body;
        if (!name) {
          throw new Error('Category name is required');
        }
        const existingCategory = await collection.findOne({ name });
        if (existingCategory) {
          throw new Error('Category already exists');
        }
        const category = await collection.insertOne({ name });
        res.status(201).json(category.ops[0]);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
