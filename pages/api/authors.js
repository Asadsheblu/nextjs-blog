import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  const { method, query } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection('authors');

  switch (method) {
    case 'GET':
      try {
        const authors = await collection.find({}).toArray();
        res.status(200).json(authors);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const newAuthor = await collection.insertOne(body);
        res.status(201).json(newAuthor.ops[0]);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const { id } = query;
        const updatedAuthor = await collection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: body },
          { returnOriginal: false }
        );
        res.status(200).json(updatedAuthor.value);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const { id } = query;
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(204).end();
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
