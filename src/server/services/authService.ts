import User, { IUser } from '../../models/User';
import bcrypt from 'bcryptjs';

const authService = {
  // Register a new user
  register: async (username: string, password: string, email?: string): Promise<IUser> => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        username,
        password: hashedPassword,
        email
      });

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (username: string, password: string): Promise<IUser> => {
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;