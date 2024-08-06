import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST requests allowed' });
    return;
  }

  const { collectionName } = req.body;

  if (!collectionName) {
    res.status(400).json({ message: 'Collection name is required' });
    return;
  }

  const { db } = await connectToDatabase();

  try {
    const content = await db.collection(collectionName).find({}).toArray();

    res.setHeader('Content-Disposition', `attachment; filename=${collectionName}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(content, null, 2));
  } catch (error) {
    console.error('Error exporting content:', error);
    res.status(500).json({ message: 'Error exporting content', error: error.message });
  }
}
