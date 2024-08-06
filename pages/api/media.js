import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/mongodb';
import { slugify } from '../../utils/slugify'; // Ensure this utility function exists

const sanitizeFilename = (filename) => {
  const name = filename.substring(0, filename.lastIndexOf('.'));
  const extension = filename.substring(filename.lastIndexOf('.'), filename.length);
  const sanitizedBaseName = name
    .replace(/[^a-zA-Z-]/g, '') // Remove everything except alphabets and hyphens
    .replace(/--+/g, '-')       // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, '')    // Remove leading and trailing hyphens
    .toLowerCase();
  return sanitizedBaseName + extension;
};

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const sanitizedFilename = sanitizeFilename(file.originalname);
      cb(null, sanitizedFilename);
    },
  }),
});

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    await runMiddleware(req, res, upload.single('file'));

    const { title } = req.body;

    try {
      const sanitizedTitle = slugify(title || req.file.originalname);
      const filePath = path.join(process.cwd(), 'public/uploads', req.file.filename);
      const url = `/uploads/${req.file.filename}`;

      const imageMetadata = {
        title: title || req.file.originalname,
        url: url,
        uploadDate: new Date(),
      };

      const result = await db.collection('images').insertOne(imageMetadata);
      if (!result.acknowledged) {
        throw new Error('Error inserting content');
      }
      res.status(200).json({ message: 'Image uploaded successfully.', data: { _id: result.insertedId, ...imageMetadata } });
    } catch (error) {
      console.error('Error inserting content:', error);
      res.status(500).json({ message: 'Error inserting content', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const image = await db.collection('images').findOne({ _id: new ObjectId(id) });
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const filePath = path.join(process.cwd(), 'public', image.url);
      fs.unlinkSync(filePath);

      await db.collection('images').deleteOne({ _id: new ObjectId(id) });

      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting content:', error);
      res.status(500).json({ message: 'Error deleting content', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const images = await db.collection('images').find().toArray();
      res.status(200).json({ images });
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ message: 'Error fetching images', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only POST, DELETE, and GET requests allowed' });
  }
};

export default handler;
