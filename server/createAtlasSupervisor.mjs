import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://anganeha289_db_user:Nehayadav111@vibasa.ewznkjn.mongodb.net/smart_waste?appName=Vibasa';

await mongoose.connect(MONGODB_URI);
console.log('Connected to Atlas');

const hash = await bcrypt.hash('Admin123', 10);

const result = await mongoose.connection.collection('users').insertOne({
  email: 'admin@smartwaste.com',
  passwordHash: hash,
  role: 'supervisor',
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log('Supervisor created in Atlas:', result.insertedId);
await mongoose.disconnect();
process.exit(0);
