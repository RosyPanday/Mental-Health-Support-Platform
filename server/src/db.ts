import { Sequelize, DataTypes } from 'sequelize';

// SQLite Database Setup (यसले प्रोजेक्टभित्रै database.sqlite फाइल आफैं बनाउँछ)
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// User Table को Structure
export const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Database Sync गर्ने function
export async function connectDB() {
  try {
    await sequelize.sync(); // Table छैन भने आफैं बनाउँछ
    console.log('📦 SQLite Database connected successfully.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}