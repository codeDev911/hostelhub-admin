import nodemailer from "nodemailer";

interface EmailProps {
  sender: "No reply" | "Registration" | "Payments" | "Notification" | "Booking";
  html: any;
  subject: any;
  to: any;
  server?: "zepto" | "sender" | "brevo" | "mailjet"|"ahasend"|"mailtrap";
}

let users = [
  {
    id: "No reply",
    name: "Hostelhub",
    email: "no_reply@hostelhub.pk",
  },
  {
    id: "Registration",
    name: "Hostelhub",
    email: "registration@hostelhub.pk",
  },
  {
    id: "Payments",
    name: "Hostelhub payments",
    email: "payment@hostelhub.pk",
  },
  {
    id: "Notification",
    name: "Hostelhub",
    email: "notification@hostelhub.pk",
  },
  {
    id: "Booking",
    name: "Hostelhub bookings",
    email: "booking@hostelhub.pk",
  },
];

const getSender = (sender: any): { id: any; name: any; email: any } => {
  return users.filter((i: any) => i.id == sender)[0];
};

class Server {
  async sender(sender: any, to: any, subject: any, html: any) {
    try {
      const data = {
        to: {
          email: to,
        },
        from: {
          email: getSender(sender).email,
          name: getSender(sender).name,
        },
        subject,
        html,
      };

      const res = await fetch("https://api.sender.net/v2/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDER_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log("Email sent via sender:");
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      return { success: false };
    }
  }

  async zepto(sender: any, to: any, subject: any, html: any) {
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
        from: `"${getSender(sender).name}" <${getSender(sender).email}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent via zepto:", info.messageId);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async mailjet(sender: any, to: any, subject: any, html: any) {
    try {
      const transporter = nodemailer.createTransport({
        host: "in-v3.mailjet.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILJET_MAIL_USER,
          pass: process.env.MAILJET_MAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${getSender(sender).name}" <${getSender(sender).email}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent via mailjet:", info.messageId);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

   async ahasend(sender: any, to: any, subject: any, html: any) {
    try {
      
      const transporter = nodemailer.createTransport({
        host: "send.ahasend.com", // Server (Europe)
        port: 587,
        requireTLS: true, 
        auth: {
          user: process.env.AHASEND_MAIL_USER,
          pass: process.env.AHASEND_MAIL_PASS,
        },
      });

      const em = getSender(sender).email // example@hostelhub.pk
      let ema = em.split("@")[0] // example
      let em2 = "@mail."+em.split("@")[1] // @mail.+hostelhub.pk
      let email = ema+em2 // example@mail.hostelhub.pk
      
      const info = await transporter.sendMail({
        from: `"${getSender(sender).name}" <${email}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent via ahasend:", info.messageId);

      return { success: true };
    } catch (error) {
      console.log(error);
      
      return { success: false };
    }
  }
   async mailtrap(sender: any, to: any, subject: any, html: any) {
    try {
      
      const transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io", 
        port: 587,
        requireTLS: true, 
        auth: {
          user: process.env.MAILTRAP_MAIL_USER,
          pass: process.env.MAILTRAP_MAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${getSender(sender).name}" <${getSender(sender).email}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent via ahasend:", info.messageId);

      return { success: true };
    } catch (error) {
      console.log(error);
      
      return { success: false };
    }
  }




  async brevo(sender: any, to: any, subject: any, html: any) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_MAIL_USER,
          pass: process.env.BREVO_MAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${getSender(sender).name}" <${getSender(sender).email}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent via brevo:", info.messageId);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

const Servers = ["zepto", "sender", "mailjet","ahasend", "brevo","mailtrap"];

export async function sendHtmlEmail({
  html,
  sender,
  subject,
  to,
  server,
}: EmailProps) {
  try {
    const server_: any = new Server();

    // Send directly with the provided server
    if(server){
      const result = await server_[server](sender, to, subject, html);
       if (result.success) {
        console.log(`Email sent using provider: ${server}`);
        return { server, success: true };
      } else {
        console.log(result);
        
        console.error(`Failed using ${server}`, result.error);
        return { server, success: false };
      }
    }

    for (const provider of Servers) {
      const result = await server_[provider](sender, to, subject, html);

      if (result.success) {
        console.log(`Email sent using provider: ${provider}`);
        return { provider, success: true };
      } else {
        console.error(`Failed using ${provider}`, result.error);
      }
    }

    return { success: false, provider: null, error: "All providers failed" };
  } catch (error) {
    return { success: false, provider: null, error: "Server error" };
  }
}
