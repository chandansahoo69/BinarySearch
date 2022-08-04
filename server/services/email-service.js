const nodemailer = require("nodemailer");
// setting the dotenv file
// const dotenv = require("dotenv");
// dotenv.config();

class MailService {
  async sendMail(email, otp) {
    // Only needed if you don't have a real mail account for testing
    // Let testAccount = await nodemailer.createTestAccount();

    // Create a nodemailer transporter
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "connect.clueless@gmail.com",
        pass: "npwbysgrkwixflrv",
        // user: testAccount.user, // generated ethereal user
        // pass: testAccount.pass, // generated ethereal password
      },
    });
    // Html template for mail
    const template = `<div className="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
            <div className="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
                <h3 className="text-2xl">Thanks for signing up.</h3>

                <p>We're happy you're here:<br/></p>
                <p>Yours BinarySearch OTP is:<br/></p>
                <h1 className="text-center text-blue-600 text-2xl font-mono font-semibold">${otp}</h1>
                <p>OTP will expire after 120 sec.<br/></p>
            </div>
        </div>`;

    // Send out email through nodemailer
    const mailOptions = {
      from: "connect.clueless@gmail.com",
      to: email,
      subject: "Hello Dev.",
      //   text: `Yours BinarySearch OTP is ${otp}`,
      html: template,
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Mail Error", error);
      } else {
        console.log("email sent" + info.response);
      }
    });
  }
}

module.exports = new MailService();
