const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    return queryInterface.bulkInsert('users', [{
      id: 1,
      name: 'Admin User',
      email: 'admin@smartstudypath.com',
      password: hashedPassword,
      role: 'admin',
      is_email_verified: true,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin@smartstudypath.com' }, {});
  }
};
