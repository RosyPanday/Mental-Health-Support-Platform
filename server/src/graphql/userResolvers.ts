import { User } from '../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'SUPER_SECRET_KEY_123';

export const userResolvers = {
  Mutation: {
    signup: async (_: any, { input }: any) => {
      const { username, name, phoneNumber, role, password, confirmPassword } = input;

      // Password Confirm
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      // 1. Username check 
      const userExists = await User.findOne({ where: { username } });
      if (userExists) {
        throw new Error("Username is already taken!");
      }

      // 3. Password Security encrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. SQLite Database मा युजर सेभ गर्ने
      const newUser: any = await User.create({
        username,
        name,
        phoneNumber,
        role,
        password: hashedPassword,
      });

      // 7. For user JWT Token बनाउने
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 8. फ्रन्टइन्डलाई रेस्पोन्स र टोकन फर्काउने
      return {
        message: "Signup successful!",
        token: token,
        user: {
          username: newUser.username,
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
        },
      };
    },
  },
};