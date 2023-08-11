import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const createSuperAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingSuperAdmin = await User.findOne({ where: { email, role: 'super_admin' } });
    if (existingSuperAdmin) {
      return res.status(409).json({ error: 'Super admin with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'super_admin',
    });


    res.status(201).json({ message: 'Super admin account created successfully.' });
  } catch (err) {
    console.error('Error creating super admin:', err);
    res.status(500).json({ error: 'Failed to create super admin account.' });
  }
};

export const createStaffMembers = async (req: Request, res: Response) => {
  
    try {
      
        const { name, email } = req.body;
  
        const existingStaffMember = await User.findOne({ where: { email, role: 'staff' } });
        if (existingStaffMember) {
          res.send({ email, error: 'Staff member with this email already exists.' }); 
        }
  
        const generatedPassword = generateRandomPassword();
  
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  
        await User.create({
          name,
          email,
          password: hashedPassword,
          role: 'staff',
        });
  
        await sendInvitationEmail(email, generatedPassword);
      
  
  
      res.status(201).json({ email, message: 'Staff member account created and invitation sent successfully.' });
    } catch (err) {
      console.error('Error creating staff members:', err);
      res.status(500).json({ error: 'Failed to create staff members and send invitations.' });
    }
  };

  import * as nodemailer from 'nodemailer';

export const sendInvitationEmail = async (email: string, generatedPassword: string) => {
  let config = {
    service : 'gmail',
    auth : {
        user: 'dineshkumar170800@gmail.com',
        pass: 'oobyquodahpxbicw'
    }
}

let transporter = nodemailer.createTransport(config);
const message = {
     from: 'dineshkumar170800@gmail.com', 
     to: email,
     subject: 'Invitation to Join Our Team', 
     text: `Hello,\n\nYou are invited to join our team. Please find your login details below:\n\nEmail: ${email}\nPassword: ${generatedPassword}\n\nThank you!\nYour Team`, // Customize the email content
   };

transporter.sendMail(message).then(() => {
    console.log( "you should receive an email")
}).catch(error => {
    return error
})
} 

  


const generateRandomPassword = (length: number = 12) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
  
    return password;
  };
  