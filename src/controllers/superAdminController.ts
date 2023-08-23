import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Helper from '../helpers/helper';
const helper = new Helper();

class SuperAdminController{
  createSuperAdmin = async (req: Request, res: Response) => {
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
  
  createStaffMembers = async (req: Request, res: Response) => {
    
      try {
        
          const { name, email } = req.body;
    
          const existingStaffMember = await User.findOne({ where: { email, role: 'staff' } });
          if (existingStaffMember) {
            res.send({ email, error: 'Staff member with this email already exists.' }); 
          }
    
          const generatedPassword = helper.generateRandomPassword();
    
          const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    
          await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'staff',
          });
    
          await helper.sendInvitationEmail(email, generatedPassword);
        
    
    
        res.status(201).json({ email, message: 'Staff member account created and invitation sent successfully.' });
      } catch (err) {
        console.error('Error creating staff members:', err);
        res.status(500).json({ error: 'Failed to create staff members and send invitations.' });
      }
    }; 

}





export default SuperAdminController;