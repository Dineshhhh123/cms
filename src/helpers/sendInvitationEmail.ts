import * as nodemailer from 'nodemailer';

export const sendInvitationEmail = async (email: string, generatedPassword: string) => {
    let config = {
      service : 'gmail',
      auth : {
          user: process.env.MAILER,
          pass: process.env.MAILER_PASS
      }
  }
  
  let transporter = nodemailer.createTransport(config);
  const message = {
       from: process.env.MAILER, 
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