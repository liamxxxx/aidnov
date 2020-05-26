const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// new Email(user, url).sendWelcome();
// SendWelcome envoie un message au user

class Email {
  // Definition du contruction pour les variables qui devront
  // s'initialiser lors de la creation de l'objet Email
  constructor(user, url) {
    this.to = user.email;
    this.nom = user.nom;
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`;
  }

  // Create method for differents transport
  newTransport() {
    /**
     * Creation de mode de transport pour l'envoie du mail
     * En production on utilise sendGrid
     * Tant dis que en developement on utilise le localhost
     */
    if (process.env.NODE_ENV === "development") {
      // MAILGUN
      return nodemailer.createTransport({
        host: process.env.MAILGUN.HOST,
        port: process.env.MAILGUN_PORT,
        service: 'SendGrid',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
    }

    // En developement on utilise Nodemail localhost
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Method for send email template
  async send(subject, template) {
    // Render htmt base on pug template
    /**
     * 1 - On crée le fichier html a envoyer, en lui passant les variables à utiliser
     *  dans le template
     *
     * 2- On defini les options pour l'envoie de mail
     *
     * 3 - A l'aide de la methode de transport ci-dessus on envoie l'email.
     *
     */

    // 1- Generation du template html
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        nom: this.nom,
        url: this.url,
        subject,
      }
    );

    // 2- Parametrage des options pour l'envoie de mail
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html)
    };

    // 3) Creation du transport et envoie du mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome Page", "welcome");
  }

  async resetPassword() {
    await this.send("Send reset password link", "passwordReset");
  }
}

module.exports = Email;
