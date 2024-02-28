const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4fa7878e047c5c",
    pass: "51575d7047c3b2"
  }
});

module.exports = transport;