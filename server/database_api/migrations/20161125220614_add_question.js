exports.up = function(knex, Promise) {
  return addQuestion()
    .catch((err) => console.log(err));

  function addQuestion(){
    return knex.schema.table('polls', function(table){
      table.text('question')
    })
  }
};

exports.down = function(knex, Promise) {
  return removeQuestion()
    .catch((err) => console.log(err));

  function removeQuestion(){
    return knex.schema.table('polls', function(table){
      table.dropColumn('question')
    })
  }
};
