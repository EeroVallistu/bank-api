const { Sequelize } = require('sequelize');
const config = require('../config/database');
const { logger } = require('../utils/logger');

// Determine the environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Ensure dialect is explicitly set
if (!dbConfig.dialect) {
  dbConfig.dialect = 'mysql'; // Set default dialect
}

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect, // Explicit dialect is required
    logging: dbConfig.logging,
    define: {
      ...dbConfig.define,
      // Never automatically create or update tables
      // This helps prevent index duplication
      sync: { force: false, alter: false }
    },
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', { error: error.message, stack: error.stack });
    return false;
  }
}

module.exports = { sequelize, testConnection };