const nodemailer = require("nodemailer");

const sendEmail= async (options)=>{
    const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: '2525',
    auth: {
      user: '42de8abcd51dc6',
      pass: '5df99558c5937e' 
    }
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject:options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
}
module.exports = sendEmail;