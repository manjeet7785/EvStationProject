// Run this in MongoDB Compass or mongosh terminal
// Replace 'your-email@example.com' with the actual email

db.users.updateOne(
  { email: 'your-email@example.com' },
  { $set: { isAdmin: true } }
);

// Verify it worked:
db.users.findOne({ email: 'your-email@example.com' });
