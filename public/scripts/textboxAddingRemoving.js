$(function() {

//////////////////////// FUNCTION FOR OPTIONS TEXTBOXES ////////////////////

  function minusSigns() {
  if ($(".selectOptions").find(".optionsTextarea").length > 1) {
    $(".minusOptions").show();
  } else $(".minusOptions").hide();
  }
  minusSigns();

  $(".plusOptions").click(function () {
    var optionsList = $('#container').find('.selectOptions');
    $(optionsList).append(`<li><textarea name="options" class="optionsTextarea"></textarea></li>`);
    minusSigns();
  })

  $(".minusOptions").click(function () {
    var optionsList = $('.selectOptions').find('.optionsTextarea');
    optionsList.last().remove();
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
    var emailsList = $('#container').find('.selectRecipients');
    $(emailsList).append(`<li><textarea name="emails" class="emailTextarea"></textarea></li>`);
    minusSigns2();
  })

  $(".minusEmails").click(function () {
    var emailsList = $('.selectRecipients').find('.emailTextarea');
    emailsList.last().remove();
    minusSigns2();
  });

});
