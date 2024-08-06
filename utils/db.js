// utils/db.js
import { connectToDatabase } from './mongodb'; // Ensure you have a function to connect to your MongoDB

export async function updateUserAccess(customerId, hasAccess) {
  const { db } = await connectToDatabase();

  // Assuming your user collection has a field `customerId` to link Stripe customer with your user
  await db.collection('user').updateOne(
    { customerId: customerId },
    { $set: { hasAccess: hasAccess } }
  );
}
