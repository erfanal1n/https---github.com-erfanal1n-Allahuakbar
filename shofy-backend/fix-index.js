require("dotenv").config();
const mongoose = require('mongoose');
const { secret } = require('./config/secret');

// MongoDB URL from environment variable
const MONGO_URI = secret.db_url;

const fixIndexIssue = async () => {
  try {
    console.log('Connecting to MongoDB to fix index issue...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connection successful!');
    
    // Check if the conversations collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const conversationsExists = collections.some(c => c.name === 'conversations');
    
    if (conversationsExists) {
      console.log('✅ Conversations collection found');
      
      // Check if the sessionId index exists
      const indexes = await mongoose.connection.db.collection('conversations').indexes();
      const sessionIdIndex = indexes.find(index => index.name === 'sessionId_1');
      
      if (sessionIdIndex) {
        console.log('🔍 Found sessionId index with unique constraint');
        
        // Drop the problematic index
        console.log('⚠️ Dropping sessionId_1 index...');
        await mongoose.connection.db.collection('conversations').dropIndex('sessionId_1');
        console.log('✅ Successfully dropped sessionId_1 index');
      } else {
        console.log('✅ No problematic sessionId index found');
      }
    } else {
      console.log('❌ Conversations collection not found');
    }
    
    // Clean up
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
    console.log('🎉 Index fix completed! You can now start the server.');
  } catch (error) {
    console.error('❌ Error fixing index:', error.message);
    console.error(error);
  }
};

// Run the fix
fixIndexIssue();
