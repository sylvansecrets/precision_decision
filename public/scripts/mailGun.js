module.exports = function mailGun(sendTo, unique_string){
    var api_key = 'key-5b273859ee5a0c9347067eaa4c06cd26';
    var domain = 'sandbox152eae173f6a41019aab5846b312336e.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    var data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: `${sendTo}`,
      subject: 'Hello',
      text: `Follow this link to the poll: http://localhost:8080/polls/${unique_string}`
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }