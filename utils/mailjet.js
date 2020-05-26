const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const pug = require('pug');

const mailjetSend = async(user, template, subject, url) => {

  // Generation du template html
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${template}.pug`,
    {
      nom: `${user.nom}`,
      url: `${url}`,
      subject,
    }
  );

  const request = mailjet.post("send", {'version': 'v3.1'})
  .request({
    "Messages": [
      {
        "From":{
          "Email":`${process.env.EMAIL_FROM}`,
          "NAME": "AidNov"
        },
        "To": [
          {
            "Email":`${user.email}`,
            "Name": `${user.nom}`
          }
        ],
        "Subject": `${subject}`,
        "HTMLPart":`${html}`
      }
    ]
  });

  request
    .then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err.statusCode)
    });

    return request;
 
}

module.exports = mailjetSend;