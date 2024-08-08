import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query: { slug, id }, body } = req;
  
  const { db } = await connectToDatabase();
  const categoriesCollection = db.collection('categories');
  const blogsCollection = db.collection('blogs');

  switch (method) {
    case 'GET':
      if (slug) {
        // Fetch a specific category by slug
        try {
          const category = await categoriesCollection.findOne({ slug });
          if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
          }
          const blogs = await blogsCollection.find({ categoryId: category._id }).toArray();
          res.status(200).json({ category, blogs });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      } else {
        // Fetch all categories
        try {
          const categories = await categoriesCollection.find({}).toArray();
          res.status(200).json(categories);
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      }
      break;
    case 'POST':
      try {
        const { name, slug, parentCategory, description } = body;
        if (!name || !slug) {
          throw new Error('Name and Slug are required');
        }
        const existingCategory = await categoriesCollection.findOne({ slug });
        if (existingCategory) {
          throw new Error('Category already exists');
        }
        const newCategory = {
          name,
          slug,
          parentCategory: parentCategory || null,
          description: description || ''
        };
        const result = await categoriesCollection.insertOne(newCategory);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const { name, slug, parentCategory, description } = body;
        if (!name || !slug) {
          throw new Error('Name and Slug are required');
        }
        const updateCategory = {
          $set: {
            name,
            slug,
            parentCategory: parentCategory || null,
            description: description || ''
          }
        };
        const result = await categoriesCollection.updateOne(
          { _id: new ObjectId(id) },
          updateCategory
        );
        if (result.matchedCount === 0) {
          throw new Error('Category not found');
        }
        const updatedCategory = await categoriesCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(updatedCategory);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          throw new Error('Category not found');
        }
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
