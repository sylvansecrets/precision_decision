module.exports = function createInputObject(bodyObject) {
    let inputObject = {
      question: null,
      expire: null,
      emails: {
        admin: null,
        others: []
      },
      options: []
    }
    inputObject.question = bodyObject.question;
    for(let i = 0; i < bodyObject.options.length || i < bodyObject.options_embed.length; i++) {
      inputObject.options.push(
        {    question_text: bodyObject.options[i],
             question_embed: bodyObject.options_embed[i]
        }
      )
    }
    if(typeof bodyObject.emails === 'object') {
      bodyObject.emails.forEach(function(email) {
        inputObject.emails.others.push(email);
      });
    } else {
      inputObject.emails.others.push(bodyObject.emails);
    }
    inputObject.emails.admin = bodyObject.adminEmail;
    inputObject.options.question
    return inputObject;
}
