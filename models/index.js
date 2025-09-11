import User from './User.js';
import Material from './Material.js';
import Delivery from './Delivery.js';

// User has many Materials (One-to-Many)
User.hasMany(Material, {
  foreignKey: 'user_id',
  as: 'materials',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Material belongs to User (Many-to-One)
Material.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'uploader',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// User has many Deliveries (One-to-Many)
User.hasMany(Delivery, {
  foreignKey: 'user_id',
  as: 'deliveries',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Delivery belongs to User (Many-to-One)
Delivery.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'recipient',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Material has many Deliveries (One-to-Many)
Material.hasMany(Delivery, {
  foreignKey: 'material_id',
  as: 'deliveries',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Delivery belongs to Material (Many-to-One)
Delivery.belongsTo(Material, {
  foreignKey: 'material_id',
  as: 'material',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Export all models
export {
  User,
  Material,
  Delivery
};

// This file sets up all the relationships between models
// and exports them for use in the application
