import mongoose from 'mongoose';
// Check what DB the server uses
await mongoose.connect('mongodb://localhost:27017/smart-waste');
const users1 = await mongoose.connection.collection('users').find({}).toArray();
console.log('smart-waste users:', JSON.stringify(users1));
await mongoose.disconnect();

await mongoose.connect('mongodb://localhost:27017/smart_waste');
const users2 = await mongoose.connection.collection('users').find({}).toArray();
console.log('smart_waste users:', JSON.stringify(users2));
await mongoose.disconnect();
process.exit(0);
