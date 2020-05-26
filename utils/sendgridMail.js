const sgMail = require("@sendgrid/mail");
const pug = require("pug");
const htmlToText = require("html-to-text");

class sendgridMail {

  constructor(user, url) {
    this.to = user.email;
    this.nom = user.nom
    this.url = url
    this.from = `${process.env.EMAIL_FROM}`
  }

   sendEmail(subject, template) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        nom: this.nom,
        url: this.url,
        subject,
      }
    );

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: this.to,
      from: this.from,
      subject: subject,
      text: htmlToText.fromString(html),
      html: html,
    };
    return await sgMail.send(msg);
  }

  async sendWelcome () {
    await this.sendEmail("Welcome page", "welcome").s
  }
}


module.exports = sendgridMail;