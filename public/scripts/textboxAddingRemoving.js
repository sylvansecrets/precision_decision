$('.plusSign').click(function () {
    var textbox = $(this).closest('textbox');
    console.log(textbox);
    // if (textbox.find('input:text').length < 7) {
    //     textbox.append('<span class="selectQuestion"><textarea name="styled-textarea" class="questionTextarea" placeholder="What restaurant should we visit tonight?"></textarea></span>');
    // }
});
$('.minusSign').click(function () {
    var textbox = $(this).closest('textbox');
    if (textbox.find('input:text').length > 1) {
        textbox.find('input:text').last().closest('textarea').remove();
    }
});








// $(document).ready(function(){
//     var counter = 2;

//     $(".plusSign").click(function () {

//   if(counter>10){
//             alert("Sorry, only 10 please!");
//             return false;
//   }

//   var newTextBoxSpan = $(document.createElement('span'))
//        .attr("class", 'TextBoxSpan' + counter);


//   newTextBoxSpan.after().html('<label>Textbox #'+ counter + ' : </label>' +
//         '<input type="text" name="textbox' + counter +
//         '" class="textbox' + counter + '" value="" >');

//   newTextBoxSpan.appendTo(".selectOptions");

//   counter++;
//      })

//   });


////////////////////////////////////////////////////////////////

    // REMOVING TEXTBOX BUTTON - NOT USING CURRENTLY

  //    $("#removeButton").click(function () {
  // if(counter==1){
  //         alert("No more textbox to remove");
  //         return false;
  //      }

  // counter--;

  //       $("#TextBoxDiv" + counter).remove();

  //    });




// GET BUTTON VALUE - (NOT NEEDED)


  //    $("#getButtonValue").click(function () {

  // var msg = '';
  // for(i=1; i<counter; i++){
  //     msg += "\n Textbox #" + i + " : " + $('#textbox' + i).val();
  // }
  //       alert(msg);
  //    });
  // });