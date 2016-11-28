module.exports = function mailGun(sendTo, subject, emailBody){
    var api_key = 'key-f8a452098da295d15b2f53bfdca0fd9c';
    var domain = 'sandbox09d5e8574cf2433783f9a2bcc98cd787.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    var data = {
      from: 'PROPOLLER <me@samples.mailgun.org>',
      to: `${sendTo}`,
      subject: `${subject}`,
      text: `${emailBody}`
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }
