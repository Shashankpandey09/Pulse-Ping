import nodemailer from "nodemailer";           // Email notifications
// Configuring Nodemailer transporter 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",    // Gmail SMTP host 
  port: 587,                 
  secure: false,             
  auth: {
    user: process.env.EMAIL_USER,  // Gmail address
    pass: process.env.EMAIL_PASS,  // Gmail App Password 
  },
});

  
  export async function sendDownAlert(monitorName: string, url: string,userEmail:string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,       // admin or user email
      subject: `Alert: Monitor ${monitorName} is DOWN`,
      text: `The monitor for URL ${url} is DOWN as of ${new Date().toLocaleDateString()}`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Alert email sent for monitor ${monitorName}`);
    } catch (err) {
      console.error('Error sending alert email:', err);
    }
  }