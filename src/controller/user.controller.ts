import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserServices from '../services/userService';
import { signupValidation, loginValidation } from '../validation/userValidation';
import jwtHelper from '../utils/jwt';

const {
  getUsers,
  createUser,
  findUser,
  verifyUser,
  findById,
  updateUser,
  deleteUser,
  checkUsername,
} = UserServices;

const { generateToken } = jwtHelper;

export default class UserController {
  static async createNewUser(req: Request, res: Response) {
    const { email, username, password } = req.body;
    try {
      const { error } = signupValidation({ email, username, password });
      if (error) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }
      const emailExist = await findUser(email.toLowerCase());
      const usernameExist = await checkUsername(username.toLowerCase());
      if (emailExist) {
        return res.status(409).json({
          error: true,
          message: 'Sorry, an account is already registered with this email.',
        });
      }
      if (usernameExist) {
        return res.status(409).json({
          error: true,
          message: 'Sorry, this username is already taken.',
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUserDetails = { email: email.toLowerCase(), username: username.toLowerCase(), password: hash };
      const newUser = await createUser(newUserDetails);
      const user = {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      };
      const token = await generateToken({ user });

      if (newUser) {
        return res.status(201).json({
          success: true,
          message: 'New user account created successfully.',
          token,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'User not created',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error',
      });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const { error } = loginValidation({ email, password });
      if (error) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }
      const getUser = await findUser(email.toLowerCase());
      if (!getUser) {
        return res.status(404).json({
          error: true,
          message: 'Sorry, email does not exist.',
        });
      }
      const verifyPassword = await bcrypt.compare(password, getUser.password);
      if (verifyPassword === false) {
        return res.status(404).json({
          error: true,
          message: 'Sorry, password supplied is incorrect.',
        });
      }
      //   select user data to encode with jwt
      const user = { _id: getUser._id, email: getUser.email, username: getUser.username };
      const token = await generateToken({ user });
      return res.status(200).json({
        success: true,
        message: 'logged in successfully.',
        token,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'server error.',
      });
    }
  }
}
