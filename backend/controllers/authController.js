import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { 
  mockFindUserByEmail, 
  mockCreateUser, 
  mockVerifyPassword, 
  mockFindUserById 
} from '../config/mockDB.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const userExists = mockFindUserByEmail(email);
      if (userExists) {
        res.status(400);
        throw new Error('User already exists');
      }

      const user = await mockCreateUser(name, email, password);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const user = mockFindUserByEmail(email);
      if (user && (await mockVerifyPassword(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = mockFindUserById(req.user._id);
      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      } else {
        res.status(404);
        throw new Error('User not found');
      }
    }

    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
