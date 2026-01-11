require('dotenv').config();

const { PORT = 3000, NODE_ENV, MONGO_URI, TEST_MONGO_URI } = process.env;

const mongoUri =
  NODE_ENV === 'test'
    ? TEST_MONGO_URI
    : MONGO_URI;

if (!mongoUri) {
  throw new Error('MongoDB connection string is missing');
}

module.exports = {
  PORT,
  MONGO_URI: mongoUri,
};
