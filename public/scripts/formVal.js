"use strict"

function isEmail(str){
  let ats = 0;
  let dots = 0;
  let sequence = true;
  for (let i = 0; i < str.length; i += 1){
    switch(str[i]){
      case '@':
        ats += 1;
        break;
      case '.':
        dots += 1;
        break;
    }
  }
  return (ats === 1 && dots >= 1 && sequence)
}

console.log(isEmail('rrzhang001@yahoo.ca'))


$(document).ready(function(){
  $('.previewButton').on('click', function(event){
    $('.warning').remove();
    let question_check = $('.questionTextarea').val();
    let option_check = [];
    for (let option of $('.optionsTextarea')){
      option_check.push(option.value);
    }
    let email_check = []
    for (let email of $('.emailTextarea')){
      email_check.push(email.value)
    }
    let admin_check = $('#adminEmail').val()
    console.log(question_check, "--", option_check, "--", email_check, "--", admin_check);
    let question_valid = true;
    let option_valid = true;

    if (question_check === ""){
      question_valid = false;
      $('#container').append('<p class="warning"> The question field cannot be blank </p>');
    }
    if (option_check.indexOf("") !== -1){
      option_valid = false;
      $('#container').append('<p class="warning"> One or more options are blank </p>')
    }
    if (option_check.length === 1){
      option_valid = false;
      $('#container').append('<p class="warning"> N votes, one option is no better than One Man, One Vote </p>')
    }
    let email_valid = true;
    for (let email of email_check){
      console.log("email", email, isEmail(email));
      email_valid = email_valid && isEmail(email);
    }
    if (!email_valid){
      $('#container').append('<p class="warning"> One or more emails are invalid </p>')
    }
    let admin_valid = true;
    if (!isEmail(admin_check)){
      admin_valid = false;
      $('#container').append('<p class="warning"> The poll creator\'s email is invalid </p>')
    }
    if (!(question_valid && option_valid && email_valid && admin_valid)){
      console.log("prevent default");
      event.preventDefault();
    }



  })
})