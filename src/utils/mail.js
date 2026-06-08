import "dotenv/config";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "salted",
    product: {
      name: "FiscalTrack",
      link: "http://fiscalTrack.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHtml = mailGenerator.generate(options.mailGenContent);

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USERNAME,
      pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: "csnaket2107@gmail.com",
      to: options.email,
      subject: options.subject,
      text: emailTextual,
      html: emailHtml,
    });
  } catch (err) {
    console.log(
      "email generation failed sliently. please check your credentials",
      err,
    );
  }
};

const emailVerificationMailGen = (userName, verificationUrl) => {
  return {
    body: {
      name: userName,
      intro:
        "Welcome to Expense Tracker! We're excited to help you manage your income, expenses, and financial goals in one place.",
      action: {
        instructions:
          "To activate your account and start tracking your finances, please verify your email address by clicking the button below:",
        button: {
          color: "#22C55E",
          text: "Verify Email Address",
          link: verificationUrl,
        },
      },
      outro:
        "If you didn't create an Expense Tracker account, you can safely ignore this email.",
    },
  };
};

const forgetPasswordMailGen = (userName, resetPasswordUrl) => {
  return {
    body: {
      name: userName,
      intro:
        "We received a request to reset the password for your Expense Tracker account.",
      action: {
        instructions:
          "Click the button below to create a new password. For security reasons, this link will expire after a limited time.",
        button: {
          color: "#EF4444",
          text: "Reset Password",
          link: resetPasswordUrl,
        },
      },
      outro:
        "If you didn't request a password reset, you can safely ignore this email. Your account will remain secure. Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { sendMail, emailVerificationMailGen, forgetPasswordMailGen };
