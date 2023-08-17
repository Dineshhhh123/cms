import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import Session from '../models/session';
import * as jwt from 'jsonwebtoken'
const secretKey = 'your-secret-key';


export const createSession = async (req: Request, res: Response) => {
    try {
      const { userId, token } = req.body;
      const session = await Session.create({ userId, token });
      res.status(201).json(session);
    } catch (err) {
      console.error('Error creating session:', err);
      res.status(500).json({ error: 'Failed to create session.' });
    }
  };
export const login = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;
    console.log(email)

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({userId:user.id},secretKey); 
    const session = await Session.create({ userId: user.id, token });

    res.status(200).json(session);
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to log in.' });
  }
};


export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'User', 
    });


    res.status(201).json({ message: 'User account created successfully.' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.user_id);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Failed to fetch user details.' });
  }
};
