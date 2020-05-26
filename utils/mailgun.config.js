const mailgun = require('mailgun-js');
const pug = require('pug');

const DOMAIN = 'sandbox11f12de63c20419b969783893f1e4f6b.mailgun.org';

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
  const mg = mailgun({apiKey: '4cd9aa2250c614f47757bac3cccab0ac-3e51f8d2-6ca79f6a', domain: `${DOMAIN}`});

  // Set msg
  const data = {
    from: `Aidnov <${process.env.EMAIL_FROM}>`,
    to: `${user.email}`,
    subject: `${subject}`,
    html: `${html}`
  };

  return mg.messages().send(data, function (error, body) {
    console.log(body);
    console.log(error)
  });
}

module.exports = send_mail;