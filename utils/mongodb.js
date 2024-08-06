import { MongoClient, ObjectId } from 'mongodb';

const uri = `mongodb+srv://${process.env.NEXT_PUBLIC_DB_USER}:${process.env.NEXT_PUBLIC_DB_PASS}@cluster0.s0tv2en.mongodb.net/${process.env.NEXT_PUBLIC_DB_NAME}?retryWrites=true&w=majority`;

let client;
let clientPromise;

if (!process.env.NEXT_PUBLIC_DB_USER || !process.env.NEXT_PUBLIC_DB_PASS || !process.env.NEXT_PUBLIC_DB_NAME) {
  throw new Error("Please add your MongoDB credentials to .env.local");
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the value across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const dbClient = await clientPromise;
  const db = dbClient.db(process.env.NEXT_PUBLIC_DB_NAME);
  return { client: dbClient, db };
}

export { ObjectId };
