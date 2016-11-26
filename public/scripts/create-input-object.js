module.exports = function createInputObject(bodyObject) {
  console.log('this is bodyObject', bodyObject);
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
    console.log('this is bodyObject.options: ', bodyObject.options);
    console.log('this is bodyObject.options.length: ', bodyObject.options.length);

    if(typeof bodyObject.options === 'array') {
      inputObject.options.push({
        for(let i = 0; i < bodyObject.options.length || i < bodyObject.options_embed.length; i++) {
              question_text: bodyObject.options[i],
              question_embed: bodyObject.options_embed[i]
        })
      }
    } else {
      inputObject.options.question_text = bodyObject.options;
      inputObject.options.question_embed = bodyObject.options_embed;
    }

      if(typeof bodyObject.emails === 'array') {
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
