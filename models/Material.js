import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Material = sequelize.define('materials', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notNull: { msg: 'Title is required' },
      notEmpty: { msg: 'Title cannot be empty' },
      len: {
        args: [5, 200],
        msg: 'Title must be between 5 and 200 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 2000],
        msg: 'Description cannot exceed 2000 characters'
      }
    }
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
    allowNull: false,
    validate: {
      notNull: { msg: 'Subject is required' },
      notEmpty: { msg: 'Subject cannot be empty' }
    }
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
    allowNull: false,
    validate: {
      notNull: { msg: 'Grade level is required' },
      notEmpty: { msg: 'Grade level cannot be empty' }
    }
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notNull: { msg: 'File URL is required' },
      notEmpty: { msg: 'File URL cannot be empty' },
      isUrl: { msg: 'File URL must be a valid URL' }
    }
  },
  file_type: {
    type: DataTypes.ENUM(
      'pdf', 
      'doc', 
      'docx', 
      'ppt', 
      'pptx', 
      'txt', 
      'jpg',
      'jpeg',
      'png',
      'other'
    ),
    allowNull: false,
    validate: {
      notNull: { msg: 'File type is required' },
      notEmpty: { msg: 'File type cannot be empty' }
    }
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'File size in bytes',
    validate: {
      notNull: { msg: 'File size is required' },
      isInt: { msg: 'File size must be an integer' },
      min: { args: [1], msg: 'File size must be greater than 0' }
    }
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: { msg: 'Thumbnail URL must be a valid URL' }
    }
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: { args: [0], msg: 'Price cannot be negative' }
    }
  },
  average_rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Rating cannot be less than 0' },
      max: { args: [5], msg: 'Rating cannot be more than 5' }
    }
  },
  total_ratings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Total ratings cannot be negative' }
    }
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Download count cannot be negative' }
    }
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'View count cannot be negative' }
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    validate: {
      isIn: {
        args: [['draft', 'published', 'archived']],
        msg: 'Invalid status'
      }
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'User ID is required' },
      isInt: { msg: 'User ID must be an integer' }
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'materials',
  indexes: [
    {
      fields: ['title'],
      name: 'idx_materials_title'
    },
    {
      fields: ['subject'],
      name: 'idx_materials_subject'
    },
    {
      fields: ['grade_level'],
      name: 'idx_materials_grade_level'
    },
    {
      fields: ['user_id'],
      name: 'idx_materials_user_id'
    }
  ]
});

export default Material;
