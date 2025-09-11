import { Sequelize } from 'sequelize';
import config from './config.js';
import colors from 'colors';

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool || {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    timezone: '+05:30', // Set your timezone
    dialectOptions: {
      decimalNumbers: true,
      supportBigNumbers: true,
      bigNumberStrings: false,
      // Enable if you're using SSL for your database
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    }
  }
);

// Test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.'.green.bold);
    
    // Sync all models
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Database synchronized with models'.blue);
    }
    
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to the database:'.red.bold, error.message);
    process.exit(1);
  }
};

// Handle database errors
sequelize
  .authenticate()
  .then(() => {
    console.log('🔌 Database connection has been established successfully.'.green.bold);
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:'.red.bold, err);
  });

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('🔌 Database connection closed through app termination'.yellow);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error closing database connection:'.red.bold, err);
    process.exit(1);
  }
});

export { sequelize, connectDB };
