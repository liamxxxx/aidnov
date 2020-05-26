const sgMail = require('@sendgrid/mail');
const pug = require('pug');

const send_mail = async(user, template, subject, url) => {

  // Generation du template html
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${template}.pug`,
    {
      nom: `${user.nom}`,
      url: `${url}`,
      subject,
    }
  );

  // Set API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Set msg
  const msg = {
    to: `${user.email}`,
    from: process.env.EMAIL_FROM,
    subject: `${subject}`,
    html: html
  }

  return sgMail.send(msg);
}

module.exports = send_mail;