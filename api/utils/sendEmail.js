import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const sendEmail = async (email, subject, body) => {
  try {
    let transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: body,
    };

    await transpoter.sendMail(mailOptions);
  } catch (err) {
    console.log(`Error in sending email: ${err}`);
    throw Error(err);
  }
};

export default sendEmail;
