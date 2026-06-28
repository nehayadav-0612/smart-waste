import mongoose from 'mongoose';
await mongoose.connect('mongodb://localhost:27017/smart_waste');
const result = await mongoose.connection.collection('users').deleteMany({});
console.log('Deleted from smart_waste:', result.deletedCount);
await mongoose.connect('mongodb://localhost:27017/smart-waste');
const result2 = await mongoose.connection.collection('users').deleteMany({});
console.log('Deleted from smart-waste:', result2.deletedCount);
await mongoose.disconnect();
process.exit(0);
