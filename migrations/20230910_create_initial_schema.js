const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users table
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin'),
        defaultValue: 'student'
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true
      },
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reset_password_expire: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create materials table
    await queryInterface.createTable('materials', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      subject: {
        type: DataTypes.ENUM(
          'mathematics',
          'science',
          'english',
          'history',
          'computer_science',
          'physics',
          'chemistry',
          'biology',
          'economics',
          'other'
        ),
        allowNull: false
      },
      grade_level: {
        type: DataTypes.ENUM(
          'elementary',
          'middle_school',
          'high_school',
          'college',
          'university',
          'other'
        ),
        allowNull: false
      },
      file_url: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      file_type: {
        type: DataTypes.ENUM(
          'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'other'
        ),
        allowNull: false
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      thumbnail_url: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      is_premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      average_rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      total_ratings: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      download_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create deliveries table
    await queryInterface.createTable('deliveries', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      material_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'materials',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'delivered', 'failed', 'cancelled'),
        defaultValue: 'pending'
      },
      delivery_method: {
        type: DataTypes.ENUM('email', 'download', 'api'),
        allowNull: false
      },
      delivery_address: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      delivery_metadata: {
        type: DataTypes.JSON,
        allowNull: true
      },
      delivered_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      download_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      last_downloaded_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('materials', ['title'], { name: 'idx_materials_title' });
    await queryInterface.addIndex('materials', ['subject'], { name: 'idx_materials_subject' });
    await queryInterface.addIndex('materials', ['grade_level'], { name: 'idx_materials_grade_level' });
    await queryInterface.addIndex('materials', ['user_id'], { name: 'idx_materials_user_id' });
    
    await queryInterface.addIndex('deliveries', ['material_id'], { name: 'idx_deliveries_material_id' });
    await queryInterface.addIndex('deliveries', ['user_id'], { name: 'idx_deliveries_user_id' });
    await queryInterface.addIndex('deliveries', ['status'], { name: 'idx_deliveries_status' });
    await queryInterface.addIndex('deliveries', ['delivery_method'], { name: 'idx_deliveries_delivery_method' });
    await queryInterface.addIndex('deliveries', ['created_at'], { name: 'idx_deliveries_created_at' });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order of creation
    await queryInterface.dropTable('deliveries');
    await queryInterface.dropTable('materials');
    await queryInterface.dropTable('users');
  }
};
