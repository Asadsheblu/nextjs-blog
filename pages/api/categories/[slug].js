import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  const { slug, lang = 'en' } = req.query; // Default to English if lang is not provided

  const { db } = await connectToDatabase();
  const categoriesCollection = db.collection('categories');
  const blogsCollection = db.collection('blogs');

  switch (req.method) {
    case 'GET':
      try {
        const category = await categoriesCollection.findOne({ [`translations.${lang}.slug`]: slug });
        console.log(category);
        
        if (!category) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }
        const blogs = await blogsCollection.find({ [`translations.${lang}.category`]: category.translations[lang]?.name }).toArray();
        console.log('Blogs for category:', blogs); // Log the retrieved blogs
        res.status(200).json({ category, blogs });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
