const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

module.exports = function sendMail(email, message) {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      auth: {
        user: "giahuy1996115@gmail.com",
        pass: "12071996Gh",
      },
    })
  );

  var mailOptions = {
    from: "giahuy1996115@gmail.com",
    to: email,
    subject: "Hệ thống cyber learning",
    text: message,
  };

  return transporter.transporter.mailer.sendMail(
    mailOptions,
    function (error, info) {
      if (error) {
        throw error;
        // console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
        return;
      }
    }
  );
};
