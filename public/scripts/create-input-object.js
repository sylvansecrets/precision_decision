module.exports = function createInputObject(bodyObject) {

    // EMPTY INPUT OBJECT
    let inputObject = {
      question: null,
      expire: null,
      emails: {
        admin: null,
        others: []
      },
      options: []
    }

    //INPUT OBJECT FILLER

    // QUEST
    inputObject.question = bodyObject.question;

    // ADMIN EMAIL
    inputObject.emails.admin = bodyObject.adminEmail;

    // EMAILS
    if(typeof bodyObject.emails === 'object') {
      bodyObject.emails.forEach(function(email) {
        inputObject.emails.others.push(email);
      });
    } else {
      inputObject.emails.others.push(bodyObject.emails);
    }

    // OPTIONS
    if(typeof bodyObject.options === 'string'
       && typeof bodyObject.options_embed === 'string') {
         inputObject.options.push( {
           question_text: bodyObject.options,
           question_embed: bodyObject.options_embed
         });
    } else {
      for(let i = 0; i < bodyObject.options.length; i++) {
        inputObject.options.push( {
          question_text: bodyObject.options[i],
          // question_embed: bodyObject.options_embed[i]
        });
      }
    }

    // RETURN
    return inputObject;
}
