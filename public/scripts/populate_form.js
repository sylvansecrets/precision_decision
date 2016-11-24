$(function() {
// ###########################

  function appendListItem(pollResults, type) {
    for (let type in pollResults) {
      pollResults[type].forEach(function(item) {
        const listItem = $('<li>').addClass(`${type}ListItem`).text(item);
        $(`#${type}`).append(listItem);
      });
    }
  }

// ###########################
});