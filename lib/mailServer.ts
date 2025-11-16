import nodemailer from "nodemailer";

interface EmailProps {
  sender: "No reply" | "Registration" | "Payments" | "Notification";
  html: any;
  subject: any;
  to: any;
}

let users = [
  {
    name: "No reply",
    email: "no_reply@hostelhub.pk",
  },
  {
    name: "Registration",
    email: "registration@hostelhub.pk",
  },
  {
    name: "Payments",
    email: "payment@hostelhub.pk",
  },
  {
    name: "Notification",
    email: "notification@hostelhub.pk",
  },
];

const getSenderEmail = (sender: any) : string => {
  return users.filter((i:any) => i.name == sender)[0].email;
};

export async function sendHtmlEmail({ html, sender, subject, to }: EmailProps) {
 try {
     const transporter = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZEPTO_MAIL_USER,
      pass: process.env.ZEPTO_MAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
      from: `"${sender}" <${getSenderEmail(sender)}>`,
      to,
      subject,
      html,
    });
    
    console.log("Email sent:", info.messageId);
 } catch (error) {
    console.log("email error"+error);
    
 }
}
