import { connectToDatabase } from "../../utils/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query, body } = req;

  let db, collection;
  try {
    ({ db } = await connectToDatabase());
    collection = db.collection('authors');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }

  switch (method) {
  case 'GET':
      try {
        const { name, role } = query;
        // console.log(`Received Query Params - Name: ${name}, Role: ${role}`);
  
        const filter = {};
        if (name) filter.name = name;
        if (role) filter.role = role;
  
        // console.log(`Database Filter:`, filter);
  
        const authors = await collection.find(filter).toArray();
        // console.log('Authors Found:', authors);
  
        if (authors.length === 0) {
          return res.status(404).json({ success: false, message: 'Author not found' });
        }
  
        return res.status(200).json(authors);
      } catch (error) {
        console.error('Failed to fetch authors:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch authors', error: error.message });
      }


  

    case 'POST':
      try {
        const newAuthor = await collection.insertOne(body);
        return res.status(201).json(newAuthor.ops[0]);
      } catch (error) {
        console.error('Failed to add author:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to add author', error: error.message });
      }

    case 'PUT':
      try {
        const { id } = query;
        if (!ObjectId.isValid(id)) {
          console.log(`Invalid ID: ${id}`);
          return res.status(400).json({ success: false, message: 'Invalid ID' });
        }

        console.log('Request body:', body);

        // Remove the _id field from the body if it exists
        const { _id, ...updateFields } = body;

        const updateDoc = {
          $set: updateFields
        };

        console.log('Update Document:', updateDoc);

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          updateDoc
        );

        console.log('Update Result:', result);

        if (result.matchedCount === 0) {
          console.log(`Author with ID ${id} not found`);
          return res.status(404).json({ success: false, message: 'Author not found' });
        }

        return res.status(200).json({ success: true, message: 'Author updated successfully' });
      } catch (error) {
        console.error('Error updating author:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to update author', error: error.message });
      }

    case 'DELETE':
      try {
        const { id } = query;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: 'Invalid ID' });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, message: 'Author not found' });
        }

        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting author:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to delete author', error: error.message });
      }

    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
