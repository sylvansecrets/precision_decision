$(function() {

//////////////////////// FUNCTION FOR OPTIONS TEXTBOXES ////////////////////

  function minusSigns() {
  if ($(".selectOptions").find(".optionsTextarea").length > 1) {
    $(".minusOptions").show();
  } else $(".minusOptions").hide();
  }
  minusSigns();

  $(".plusOptions").click(function () {
    var input = $('.optionsTextarea').val();
    var spanClass = $('#container').find('.selectOptions');
    $(spanClass).append(`<textarea name="styled-textarea" class="optionsTextarea" placeholder="${input}"></textarea>`);
    minusSigns();
  })

  $(".minusOptions").click(function () {
    var spanClass2 = $('.selectOptions').find('.optionsTextarea');
    spanClass2.last().remove();
    minusSigns();
  });

//////////////////////// FUNCTION FOR EMAIL TEXTBOXES /////////////////////

  function minusSigns2() {
    if ($(".selectRecipients").find(".emailTextarea").length > 1) {
      $(".minusEmails").show();
    } else $(".minusEmails").hide();
  }
  minusSigns2();

  $(".plusEmails").click(function () {
    var input = $('.emailTextarea').val();
    var spanClass3 = $('#container').find('.selectRecipients');
    $(spanClass3).append(`<textarea name="styled-textarea" class="emailTextarea" placeholder="JohnnyHockey@gmail.com"></textarea>`);
    minusSigns2();
  })

  $(".minusEmails").click(function () {
    var spanClass4 = $('.selectRecipients').find('.emailTextarea');
    spanClass4.last().remove();
    minusSigns2();
  });

});

