import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Delivery = sequelize.define('deliveries', {
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
    onDelete: 'CASCADE',
    validate: {
      notNull: { msg: 'Material ID is required' },
      isInt: { msg: 'Material ID must be an integer' }
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
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'delivered',
      'failed',
      'cancelled'
    ),
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'processing', 'delivered', 'failed', 'cancelled']],
        msg: 'Invalid delivery status'
      }
    }
  },
  delivery_method: {
    type: DataTypes.ENUM('email', 'download', 'api'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Delivery method is required' },
      notEmpty: { msg: 'Delivery method cannot be empty' },
      isIn: {
        args: [['email', 'download', 'api']],
        msg: 'Invalid delivery method'
      }
    }
  },
  delivery_address: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Email address or API endpoint for delivery'
  },
  delivery_metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional delivery information in JSON format'
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Expiration time for download links'
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Download count cannot be negative' }
    }
  },
  last_downloaded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Error details if delivery failed'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'IP address of the requester'
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User agent of the requester'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'deliveries',
  indexes: [
    {
      fields: ['material_id'],
      name: 'idx_deliveries_material_id'
    },
    {
      fields: ['user_id'],
      name: 'idx_deliveries_user_id'
    },
    {
      fields: ['status'],
      name: 'idx_deliveries_status'
    },
    {
      fields: ['delivery_method'],
      name: 'idx_deliveries_delivery_method'
    },
    {
      fields: ['created_at'],
      name: 'idx_deliveries_created_at'
    }
  ]
});

export default Delivery;
