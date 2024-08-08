import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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

const createSlug = (title) => {
  return title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export default async function handler(req, res) {
  const { method, query } = req;
  let db, client;

  try {
    ({ db, client } = await connectToDatabase());
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection error' });
  }

  const blogs = db.collection('blogs');

  switch (method) {
    case 'POST':
      await handlePostRequest(req, res, blogs);
      break;

    case 'GET':
      await handleGetRequest(req, res, blogs, query);
      break;

    case 'PUT':
      await handlePutRequest(req, res, blogs, query);
      break;

    case 'DELETE':
      await handleDeleteRequest(req, res, blogs, query);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

// Existing code...
const handlePostRequest = async (req, res, blogs) => {
  try {
    await runMiddleware(req, res, upload.single('image'));

    const formData = req.body;
    const { content, title, Title, metaTitle, description, slug, metaDescription, category, language, author, authorProfile } = formData;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const finalTitle = title || Title;

    if (!content || !finalTitle || !slug || !metaTitle || !description || !metaDescription || !category || !language || !author) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const existingBlog = await blogs.findOne({ 'translations.slug': slug });

    if (existingBlog) {
      const updateDoc = {
        $set: {
          [`translations.${language}.title`]: finalTitle,
          [`translations.${language}.content`]: content,
          [`translations.${language}.metaTitle`]: metaTitle,
          [`translations.${language}.description`]: description,
          [`translations.${language}.metaDescription`]: metaDescription,
          [`translations.${language}.category`]: category,
          [`translations.${language}.image`]: image,
          [`translations.${language}.slug`]: slug,
          author,
          authorProfile
        },
      };

      const result = await blogs.updateOne(
        { _id: existingBlog._id },
        updateDoc
      );

      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: 'Data updated successfully' });
      } else {
        return res.status(500).json({ message: 'Failed to update document' });
      }
    } else {
      const doc = {
        defaultLanguage: language,
        translations: {
          [language]: {
            title: finalTitle,
            content,
            metaTitle,
            description,
            metaDescription,
            category,
            image,
            slug,
          },
        },
        author,
        authorProfile,
        viewCount: 0,
        createdAt: new Date(),
      };

      const result = await blogs.insertOne(doc);

      if (!result.insertedId) {
        return res.status(500).json({ message: 'Failed to insert document' });
      }

      res.status(201).json(doc);
    }
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Existing code...


const handleGetRequest = async (req, res, blogs, query) => {
  try {
    if (query.id) {
      const id = query.id;
      const result = await blogs.findOne({ _id: new ObjectId(id) });

      if (!result) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.status(200).json(result);
    } else if (query.slug) {
      const slug = query.slug;
      const result = await blogs.findOne({ 'translations.slug': slug });

      if (!result) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.status(200).json(result);
    } else {
      const blogsArray = await blogs.find({}).limit(15).toArray();
      const updatedBlogsArray = blogsArray.map(blog => {
        if (!blog.translations) {
          blog.translations = {};
        }
        if (!blog.translations.en) {
          const title = blog.title || blog.Title || '';
          const content = blog.content || blog.Content || '';
          blog.translations.en = {
            title,
            content,
            metaTitle: blog.metaTitle || '',
            description: blog.description || '',
            metaDescription: blog.metaDescription || '',
            category: blog.category || '',
            image: blog.image || '',
            slug: blog.slug || createSlug(title)
          };
        }
        return blog;
      });
      res.status(200).json(updatedBlogsArray);
    }
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handlePutRequest = async (req, res, blogs, query) => {
  try {
    await runMiddleware(req, res, upload.single('image'));

    const id = query.id;
    const { language, ...updatedData } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    delete updatedData._id;

    const updateDoc = {
      $set: {
        [`translations.${language}.title`]: updatedData.title,
        [`translations.${language}.content`]: updatedData.content,
        [`translations.${language}.metaTitle`]: updatedData.metaTitle,
        [`translations.${language}.description`]: updatedData.description,
        [`translations.${language}.metaDescription`]: updatedData.metaDescription,
        [`translations.${language}.category`]: updatedData.category,
        [`translations.${language}.image`]: updatedData.image,
        [`translations.${language}.slug`]: updatedData.slug,
      },
    };

    console.log('Update Document:', updateDoc);

    const result = await blogs.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Data updated successfully' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    console.error('PUT error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleDeleteRequest = async (req, res, blogs, query) => {
  try {
    const id = query.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const result = await blogs.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
