import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const uri = process.env.MONGODB_URI;
await mongoose.connect(uri);
const existing = await mongoose.connection.collection('users').findOne({email:'admin@smartwaste.com'});
if(existing){
  const hash = await bcrypt.hash('Admin123', 10);
  await mongoose.connection.collection('users').updateOne({email:'admin@smartwaste.com'},{set:{passwordHash:hash}});
  console.log('Password updated');
} else {
  const hash = await bcrypt.hash('Admin123', 10);
  await mongoose.connection.collection('users').insertOne({email:'admin@smartwaste.com',passwordHash:hash,role:'supervisor',createdAt:new Date(),updatedAt:new Date()});
  console.log('Supervisor created');
}
await mongoose.disconnect();
