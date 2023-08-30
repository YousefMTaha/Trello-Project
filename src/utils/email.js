import nodemailer from "nodemailer";

const sendEmail = async ({to,subject,text,html,cc,bcc,attachments}={}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Practice" ${"masadoso4@gmail.com"}`, 
    to ,
    cc,
    bcc, 
    subject,
    text,
    html,
    attachments
  });

};
export default sendEmail;
