const sgMail = require("@sendgrid/mail");

require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmailSendGrid = async (data) => {
  try {
    await sgMail.send(data);
    return { status: 200, message: 'Email sent successfully' };
  } catch (error) {
    console.error(error);
    return { status: 400, message: 'Failed to send email' };
  }
};

module.exports = sendEmailSendGrid;
