require("dotenv").config();
const mongoose = require('mongoose');
const { secret } = require('./config/secret');

// MongoDB URL from environment variable
const MONGO_URI = secret.db_url;

const testMongoConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using connection string:', MONGO_URI);
    
    await mongoose.connect(MONGO_URI);
    
    console.log('✅ MongoDB connection successful!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check the conversations collection for any indexes with sessionId
    if (collections.some(c => c.name === 'conversations')) {
      console.log('Checking indexes on conversations collection...');
      const indexes = await mongoose.connection.db.collection('conversations').indexes();
      console.log('Indexes on conversations collection:', indexes);
    }
    
    // Clean up
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error(error);
  }
};

// Run the test
testMongoConnection();
