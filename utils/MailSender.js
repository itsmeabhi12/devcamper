const nodemailer = require("nodemailer");

const mailSender = async (options) =>{

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: '53d6e31186a3ee', // generated ethereal user
      pass: '424b426b8400e1', // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '53d6e31186a3ee<noreply@devcamper.io>', // sender address
    to: options.reciver, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  
}

module.exports = mailSender;